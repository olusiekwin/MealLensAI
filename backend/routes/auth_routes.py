from flask import Blueprint, request, jsonify, g
from services.session_service import session_service
from middleware.auth_middleware import require_auth, get_current_token
from db_setup import supabase
import bcrypt
import logging
from datetime import datetime, pytz

auth_bp = Blueprint('auth', __name__)
logger = logging.getLogger(__name__)

@auth_bp.route('/validate-token', methods=['GET'])
@require_auth
def validate_token():
    """Validate the current session token"""
    return jsonify({'valid': True})

@auth_bp.route('/token-info', methods=['GET'])
@require_auth
def get_token_info():
    """Get token expiration and other info"""
    result = supabase.table('sessions').select('*').eq('token', get_current_token()).execute()
    
    if not result.data:
        return jsonify({'error': 'Session not found'}), 404
        
    session = result.data[0]
    return jsonify({
        'expiration': session['expires_at'],
        'last_activity': session['last_activity']
    })

@auth_bp.route('/refresh-token', methods=['POST'])
def refresh_token():
    """Refresh an expired token using the refresh token"""
    refresh_token = request.json.get('refresh_token')
    
    if not refresh_token:
        return jsonify({'error': 'Refresh token is required'}), 400
        
    new_session = session_service.refresh_session(refresh_token)
    
    if new_session:
        return jsonify({
            'success': True,
            'data': {
                'session': new_session,
                'user': None  # User data not needed for refresh
            }
        })
    return jsonify({'error': 'Invalid refresh token'}), 401

@auth_bp.route('/logout', methods=['POST'])
@require_auth
def logout():
    """Invalidate the current session"""
    token = get_current_token()
    session_service.delete_session(token)
    return jsonify({'success': True})

@auth_bp.route('/logout-all', methods=['POST'])
@require_auth
def logout_all():
    """Logout from all devices"""
    user_id = g.user_id
    session_service.delete_user_sessions(user_id)
    return jsonify({'success': True})

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        username = data.get('username')
        
        # Validate required fields
        if not email or not password or not confirm_password:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Email, password, and confirm_password are required',
                    'code': 'missing_fields'
                }
            }), 400
            
        # Validate password match
        if password != confirm_password:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Passwords do not match',
                    'code': 'password_mismatch'
                }
            }), 400
            
        # Validate password length
        if len(password) < 6:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Password must be at least 6 characters',
                    'code': 'password_too_short'
                }
            }), 400
            
        # Check if user exists
        result = supabase.table('users').select('*').eq('email', email).execute()
        if result.data:
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Email already registered',
                    'code': 'email_taken'
                }
            }), 409
            
        # Hash password
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode(), salt)
        
        # Create user
        user_data = {
            'email': email,
            'username': username or email.split('@')[0],  # Use email prefix if no username
            'password': hashed.decode(),
            **{k:v for k,v in data.items() if k not in ['email', 'password', 'confirm_password']}
        }
        
        result = supabase.table('users').insert(user_data).execute()
        user = result.data[0]
        
        # Create session
        session = session_service.create_session(user['user_id'])
        
        # Log successful registration
        logger.info(f"User registered successfully: {email}")
        
        return jsonify({
            'success': True,
            'data': {
                'user': {
                    'id': user['user_id'],
                    'email': user['email'],
                    'username': user.get('username'),
                    'created_at': user['created_at']
                },
                'session': session
            }
        })
        
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return jsonify({
            'success': False,
            'error': {
                'message': str(e),
                'code': 'registration_failed'
            }
        }), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        logger.info(f"Login attempt for email: {email}")
        
        if not email or not password:
            logger.warning(f"Login failed: Missing fields - email: {bool(email)}, password: {bool(password)}")
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Email and password are required',
                    'code': 'missing_fields'
                }
            }), 400
            
        # Get user
        result = supabase.table('users').select('*').eq('email', email).execute()
        
        if not result.data:
            logger.warning(f"Login failed: No user found for email: {email}")
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Invalid credentials',
                    'code': 'invalid_credentials'
                }
            }), 401
            
        user = result.data[0]
        
        # Verify password
        if not bcrypt.checkpw(password.encode(), user['password'].encode()):
            logger.warning(f"Login failed: Invalid password for email: {email}")
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Invalid credentials',
                    'code': 'invalid_credentials'
                }
            }), 401
            
        # Create session
        logger.info(f"Creating session for user: {email}")
        session = session_service.create_session(user['user_id'])
        
        if not session:
            logger.error(f"Failed to create session for user: {email}")
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Failed to create session',
                    'code': 'session_creation_failed'
                }
            }), 500
            
        # Log successful login
        logger.info(f"Login successful for user: {email}")
        
        # Track login event
        try:
            supabase.table('login_events').insert({
                'user_id': user['user_id'],
                'email': email,
                'success': True,
                'ip_address': request.remote_addr,
                'user_agent': request.headers.get('User-Agent'),
                'timestamp': datetime.now(pytz.UTC).isoformat()
            }).execute()
        except Exception as e:
            logger.error(f"Failed to track login event: {str(e)}")
        
        return jsonify({
            'success': True,
            'data': {
                'user': {
                    'id': user['user_id'],
                    'email': user['email'],
                    'username': user.get('username'),
                    'created_at': user['created_at']
                },
                'session': session
            }
        })
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        
        # Track failed login
        try:
            supabase.table('login_events').insert({
                'email': request.json.get('email'),
                'success': False,
                'error': str(e),
                'ip_address': request.remote_addr,
                'user_agent': request.headers.get('User-Agent'),
                'timestamp': datetime.now(pytz.UTC).isoformat()
            }).execute()
        except Exception as track_error:
            logger.error(f"Failed to track failed login: {str(track_error)}")
        
        return jsonify({
            'success': False,
            'error': {
                'message': str(e),
                'code': 'login_failed'
            }
        }), 500 
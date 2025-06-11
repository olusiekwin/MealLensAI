from functools import wraps
from flask import request, jsonify, g, current_app
from services.session_service import session_service
import logging

logger = logging.getLogger(__name__)

def get_token_from_header():
    """Extract token from Authorization header"""
    auth_header = request.headers.get('Authorization')
    
    # Log the auth header for debugging (redact token)
    if auth_header:
        redacted = auth_header[:20] + '...' if len(auth_header) > 20 else auth_header
        logger.debug(f"Received Authorization header: {redacted}")
    else:
        logger.debug("No Authorization header present")
        return None
        
    parts = auth_header.split()
    
    # Validate header format
    if len(parts) != 2:
        logger.warning(f"Invalid Authorization header format: {redacted}")
        return None
        
    if parts[0].lower() != 'bearer':
        logger.warning(f"Invalid Authorization type: {parts[0]}")
        return None
        
    token = parts[1]
    
    # Basic token format validation
    if not token or token.lower() == 'null' or token.lower() == 'undefined':
        logger.warning("Invalid token value received")
        return None
        
    # Log successful token extraction (redacted)
    logger.debug(f"Extracted token: {token[:10]}...")
    return token

def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        # Get the token
        token = get_token_from_header()
        
        if not token:
            logger.warning(f"Authentication failed: No valid token for {request.path}")
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Authentication required',
                    'code': 'no_token'
                }
            }), 401
            
        # Validate token and get user_id
        user_id = session_service.validate_session(token)
        
        if not user_id:
            logger.warning(f"Authentication failed: Invalid/expired token for {request.path}")
            return jsonify({
                'success': False,
                'error': {
                    'message': 'Invalid or expired token',
                    'code': 'invalid_token'
                }
            }), 401
            
        # Store user_id and token in request context
        g.user_id = user_id
        g.current_token = token
        
        # Log successful authentication
        logger.debug(f"Authenticated user {user_id} for {request.path}")
        
        return f(*args, **kwargs)
    return decorated

def get_current_user_id():
    """Get current user ID from request context"""
    return getattr(g, 'user_id', None)

def get_current_token():
    """Get current token from request context"""
    return getattr(g, 'current_token', None)

def rate_limit(limit_per_minute=60):
    """Rate limiting decorator"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get user ID or IP address for rate limiting
            key = get_current_user_id() or request.remote_addr
            
            # Check rate limit (implement with Redis in production)
            # For now, just pass through
            return f(*args, **kwargs)
        return decorated_function
    return decorator 
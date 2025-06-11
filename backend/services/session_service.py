from datetime import datetime, timedelta
import pytz
import json
import uuid
import logging
from flask import current_app, jsonify, request
from db_setup import supabase

logger = logging.getLogger(__name__)

class SessionService:
    def __init__(self):
        self.db = supabase
        self.logger = logging.getLogger(__name__)

    def create_session(self, user_id: str) -> dict:
        """Create a new session for a user"""
        try:
            self.logger.info(f"Creating new session for user: {user_id}")
            
            # Generate tokens
            token = str(uuid.uuid4())
            refresh_token = str(uuid.uuid4())
            
            # Set expiration (access token: 1 hour, refresh token: 30 days)
            expires_at = datetime.now(pytz.UTC) + timedelta(hours=1)
            refresh_expires_at = datetime.now(pytz.UTC) + timedelta(days=30)
            
            # Get device info from request headers
            device_info = {
                'user_agent': request.headers.get('User-Agent', ''),
                'ip_address': request.remote_addr,
                'platform': request.headers.get('Sec-Ch-Ua-Platform', '')
            }
            
            self.logger.debug(f"Session details - User: {user_id}, Expires: {expires_at}, Device: {device_info}")
            
            # Create session in database
            session_data = {
                'user_id': user_id,
                'token': token,
                'refresh_token': refresh_token,
                'expires_at': expires_at.isoformat(),
                'refresh_expires_at': refresh_expires_at.isoformat(),
                'device_info': json.dumps(device_info),
                'created_at': datetime.now(pytz.UTC).isoformat(),
                'last_activity': datetime.now(pytz.UTC).isoformat()
            }
            
            result = self.db.table('sessions').insert(session_data).execute()
            
            if result.data:
                session_id = result.data[0]['session_id']
                self.logger.info(f"Session {session_id} created successfully for user {user_id}")
                
                # Track session creation
                self._track_session_event(
                    user_id=user_id,
                    session_id=session_id,
                    event_type='created',
                    device_info=device_info
                )
                
                return {
                    'access_token': token,
                    'refresh_token': refresh_token,
                    'expires_at': expires_at.isoformat()
                }
                
            self.logger.error(f"Failed to create session for user {user_id}")
            return None
            
        except Exception as e:
            self.logger.error(f"Error creating session: {str(e)}", exc_info=True)
            return None

    def validate_session(self, token: str) -> str:
        """Validate a session token and return user_id if valid"""
        try:
            if not token:
                self.logger.warning("Attempted to validate null token")
                return None
                
            # Log token validation attempt (redacted)
            self.logger.debug(f"Validating token: {token[:10]}...")
            
            result = self.db.table('sessions').select('*').eq('token', token).execute()
            
            if not result.data:
                self.logger.warning(f"No session found for token: {token[:10]}...")
                return None
                
            session = result.data[0]
            
            # Check if session is expired
            expires_at = datetime.fromisoformat(session['expires_at'].replace('Z', '+00:00'))
            now = datetime.now(pytz.UTC)
            
            if expires_at < now:
                # Delete expired session
                self.logger.warning(f"Session expired for user {session['user_id']}")
                self.db.table('sessions').delete().eq('session_id', session['session_id']).execute()
                
                # Track session expiration
                self._track_session_event(
                    user_id=session['user_id'],
                    session_id=session['session_id'],
                    event_type='expired'
                )
                return None
                
            # Update last activity
            self._update_session_activity(session['session_id'], session['user_id'])
            
            self.logger.debug(f"Session validated for user {session['user_id']}")
            return session['user_id']
            
        except Exception as e:
            self.logger.error(f"Error validating session: {str(e)}", exc_info=True)
            return None

    def _track_session_event(self, user_id: str, session_id: str, event_type: str, device_info: dict = None):
        """Track session events in the database"""
        try:
            event_data = {
                'user_id': user_id,
                'session_id': session_id,
                'event_type': event_type,
                'timestamp': datetime.now(pytz.UTC).isoformat()
            }
            
            if device_info:
                event_data['device_info'] = json.dumps(device_info)
                
            self.db.table('session_events').insert(event_data).execute()
            self.logger.debug(f"Tracked session event: {event_type} for session {session_id}")
            
        except Exception as e:
            self.logger.error(f"Failed to track session event: {str(e)}")

    def _update_session_activity(self, session_id: str, user_id: str):
        """Update session last activity timestamp"""
        try:
            now = datetime.now(pytz.UTC)
            
            # Update last activity timestamp
            self.db.table('sessions').update({
                'last_activity': now.isoformat()
            }).eq('session_id', session_id).execute()
            
            # Track activity event
            self._track_session_event(
                user_id=user_id,
                session_id=session_id,
                event_type='activity'
            )
            
        except Exception as e:
            self.logger.error(f"Failed to update session activity: {str(e)}")

    def refresh_session(self, refresh_token: str) -> dict:
        """Refresh a session using a refresh token"""
        try:
            if not refresh_token:
                logger.warning("Attempted to refresh with null token")
                return None
                
            result = self.db.table('sessions').select('*').eq('refresh_token', refresh_token).execute()
            
            if not result.data:
                logger.warning(f"No session found for refresh token: {refresh_token[:10]}...")
                return None
                
            old_session = result.data[0]
            
            # Check if refresh token is expired
            refresh_expires_at = datetime.fromisoformat(old_session['refresh_expires_at'].replace('Z', '+00:00'))
            now = datetime.now(pytz.UTC)
            
            if refresh_expires_at < now:
                logger.warning(f"Refresh token expired for user {old_session['user_id']}")
                self.db.table('sessions').delete().eq('session_id', old_session['session_id']).execute()
                return None
            
            # Create new session
            new_session = self.create_session(old_session['user_id'])
            
            if new_session:
                # Delete old session
                self.db.table('sessions').delete().eq('session_id', old_session['session_id']).execute()
                logger.info(f"Session refreshed for user {old_session['user_id']}")
                
            return new_session
            
        except Exception as e:
            logger.error(f"Error refreshing session: {str(e)}")
            return None

    def delete_session(self, token: str) -> bool:
        """Delete a session"""
        try:
            if not token:
                logger.warning("Attempted to delete null token")
                return False
                
            result = self.db.table('sessions').delete().eq('token', token).execute()
            success = len(result.data) > 0
            
            if success:
                logger.info(f"Session deleted: {token[:10]}...")
            else:
                logger.warning(f"Failed to delete session: {token[:10]}...")
                
            return success
            
        except Exception as e:
            logger.error(f"Error deleting session: {str(e)}")
            return False

    def delete_user_sessions(self, user_id: str) -> bool:
        """Delete all sessions for a user"""
        try:
            if not user_id:
                logger.warning("Attempted to delete sessions for null user_id")
                return False
                
            result = self.db.table('sessions').delete().eq('user_id', user_id).execute()
            logger.info(f"Deleted all sessions for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting user sessions: {str(e)}")
            return False

    def cleanup_expired_sessions(self):
        """Clean up expired sessions (can be run as a periodic task)"""
        try:
            now = datetime.now(pytz.UTC)
            result = self.db.table('sessions').delete().lt('expires_at', now.isoformat()).execute()
            logger.info(f"Cleaned up {len(result.data)} expired sessions")
            
        except Exception as e:
            logger.error(f"Error cleaning up sessions: {str(e)}")

    def track_auth_attempt(self, email: str, success: bool, error: str = None):
        """Track authentication attempts"""
        try:
            event_data = {
                'email': email,
                'success': success,
                'ip_address': request.remote_addr,
                'user_agent': request.headers.get('User-Agent'),
                'timestamp': datetime.now(pytz.UTC).isoformat()
            }
            
            if error:
                event_data['error'] = error
                
            self.db.table('auth_events').insert(event_data).execute()
            self.logger.debug(f"Tracked auth attempt for {email}: {'success' if success else 'failed'}")
            
        except Exception as e:
            self.logger.error(f"Failed to track auth attempt: {str(e)}")

    def track_auth_attempt(self, email: str, success: bool, error: str = None):
        """Track authentication attempts"""
        try:
            event_data = {
                'email': email,
                'success': success,
                'ip_address': request.remote_addr,
                'user_agent': request.headers.get('User-Agent'),
                'timestamp': datetime.now(pytz.UTC).isoformat()
            }
            
            if error:
                event_data['error'] = error
                
            self.db.table('auth_events').insert(event_data).execute()
            self.logger.debug(f"Tracked auth attempt for {email}: {'success' if success else 'failed'}")
            
        except Exception as e:
            self.logger.error(f"Failed to track auth attempt: {str(e)}")

# Initialize session service
session_service = SessionService() 
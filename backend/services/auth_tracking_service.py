from datetime import datetime, timedelta
import pytz
import logging
from flask import request
from db_setup import supabase

logger = logging.getLogger(__name__)

class AuthTrackingService:
    def __init__(self):
        self.db = supabase
        self.logger = logging.getLogger(__name__)

    def track_auth_attempt(self, email: str, success: bool, error: str = None, user_id: str = None):
        """Track authentication attempts"""
        try:
            event_data = {
                'email': email,
                'success': success,
                'ip_address': request.remote_addr,
                'user_agent': request.headers.get('User-Agent'),
                'platform': request.headers.get('Sec-Ch-Ua-Platform', ''),
                'timestamp': datetime.now(pytz.UTC).isoformat()
            }
            
            if error:
                event_data['error'] = error
            
            if user_id:
                event_data['user_id'] = user_id
                
            self.db.table('auth_events').insert(event_data).execute()
            self.logger.info(f"Auth attempt tracked - Email: {email}, Success: {success}")
            
        except Exception as e:
            self.logger.error(f"Failed to track auth attempt: {str(e)}", exc_info=True)

    def track_password_reset(self, email: str, success: bool, error: str = None):
        """Track password reset attempts"""
        try:
            event_data = {
                'email': email,
                'success': success,
                'event_type': 'password_reset',
                'ip_address': request.remote_addr,
                'user_agent': request.headers.get('User-Agent'),
                'timestamp': datetime.now(pytz.UTC).isoformat()
            }
            
            if error:
                event_data['error'] = error
                
            self.db.table('auth_events').insert(event_data).execute()
            self.logger.info(f"Password reset attempt tracked - Email: {email}, Success: {success}")
            
        except Exception as e:
            self.logger.error(f"Failed to track password reset: {str(e)}", exc_info=True)

    def track_account_action(self, user_id: str, action: str, success: bool, error: str = None):
        """Track account-related actions (deletion, update, etc.)"""
        try:
            event_data = {
                'user_id': user_id,
                'action': action,
                'success': success,
                'ip_address': request.remote_addr,
                'user_agent': request.headers.get('User-Agent'),
                'timestamp': datetime.now(pytz.UTC).isoformat()
            }
            
            if error:
                event_data['error'] = error
                
            self.db.table('account_events').insert(event_data).execute()
            self.logger.info(f"Account action tracked - User: {user_id}, Action: {action}, Success: {success}")
            
        except Exception as e:
            self.logger.error(f"Failed to track account action: {str(e)}", exc_info=True)

    def get_auth_history(self, email: str = None, user_id: str = None, limit: int = 10):
        """Get authentication history for a user"""
        try:
            query = self.db.table('auth_events').select('*')
            
            if email:
                query = query.eq('email', email)
            if user_id:
                query = query.eq('user_id', user_id)
                
            result = query.order('timestamp', desc=True).limit(limit).execute()
            return result.data
            
        except Exception as e:
            self.logger.error(f"Failed to get auth history: {str(e)}", exc_info=True)
            return []

    def get_failed_attempts(self, email: str, minutes: int = 30):
        """Get number of failed attempts in the last X minutes"""
        try:
            cutoff = datetime.now(pytz.UTC) - timedelta(minutes=minutes)
            
            result = self.db.table('auth_events').select('*').eq('email', email).eq('success', False).gte('timestamp', cutoff.isoformat()).execute()
            
            return len(result.data)
            
        except Exception as e:
            self.logger.error(f"Failed to get failed attempts: {str(e)}", exc_info=True)
            return 0

# Initialize auth tracking service
auth_tracking_service = AuthTrackingService() 
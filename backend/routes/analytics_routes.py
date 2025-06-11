from flask import Blueprint, jsonify, request, g
from middleware.auth_middleware import require_auth
from db_setup import supabase
from datetime import datetime

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/log', methods=['POST'])
@require_auth
def log_event():
    """Log an analytics event"""
    try:
        user_id = g.user_id
        data = request.json
        
        # Add user_id and timestamp if not present
        data['user_id'] = user_id
        data['timestamp'] = data.get('timestamp', datetime.utcnow().isoformat())
        
        # Insert into analytics events table
        result = supabase.table('analytics_events').insert(data).execute()
        
        return jsonify({
            'success': True,
            'data': result.data[0]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
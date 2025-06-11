from flask import Blueprint, jsonify, g
from middleware.auth_middleware import require_auth
from db_setup import supabase

payment_bp = Blueprint('payment', __name__)

@payment_bp.route('/subscription-status', methods=['GET'])
@require_auth
def get_subscription_status():
    """Get user's subscription status"""
    try:
        user_id = g.user_id
        result = supabase.table('users').select('subscription_status', 'subscription_plan').eq('user_id', user_id).execute()
        
        if not result.data:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify({
            'success': True,
            'data': {
                'status': result.data[0]['subscription_status'],
                'plan': result.data[0]['subscription_plan']
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/history', methods=['GET'])
@require_auth
def get_payment_history():
    """Get user's payment history"""
    try:
        user_id = g.user_id
        result = supabase.table('subscription_events').select('*').eq('user_id', user_id).order('created_at', desc=True).execute()
        
        return jsonify({
            'success': True,
            'data': result.data
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
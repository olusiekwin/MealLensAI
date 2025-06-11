from flask import Blueprint, request, jsonify, g
from middleware.auth_middleware import require_auth
from services.session_service import session_service
from db_setup import supabase
import json

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@require_auth
def get_profile():
    """Get user profile"""
    try:
        user_id = g.user_id
        result = supabase.table('users').select('*').eq('user_id', user_id).execute()
        
        if not result.data:
            return jsonify({'error': 'User not found'}), 404
            
        user = result.data[0]
        # Remove sensitive data
        user.pop('password', None)
        return jsonify({'success': True, 'data': user})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/profile', methods=['PUT'])
@require_auth
def update_profile():
    """Update user profile"""
    try:
        user_id = g.user_id
        data = request.json
        
        # Remove sensitive fields if present
        data.pop('user_id', None)
        data.pop('email', None)
        data.pop('password', None)
        
        result = supabase.table('users').update(data).eq('user_id', user_id).execute()
        
        if not result.data:
            return jsonify({'error': 'User not found'}), 404
            
        user = result.data[0]
        user.pop('password', None)
        return jsonify({'success': True, 'data': user})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/favorites', methods=['GET'])
@require_auth
def get_favorites():
    """Get user favorites"""
    try:
        user_id = g.user_id
        result = supabase.table('favorites').select('*').eq('user_id', user_id).execute()
        return jsonify({'success': True, 'data': result.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/favorites', methods=['POST'])
@require_auth
def add_favorite():
    """Add item to favorites"""
    try:
        user_id = g.user_id
        data = request.json
        data['user_id'] = user_id
        
        result = supabase.table('favorites').insert(data).execute()
        return jsonify({'success': True, 'data': result.data[0]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/favorites/<item_id>', methods=['DELETE'])
@require_auth
def remove_favorite(item_id):
    """Remove item from favorites"""
    try:
        user_id = g.user_id
        result = supabase.table('favorites').delete().eq('user_id', user_id).eq('item_id', item_id).execute()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/subscription', methods=['POST'])
@require_auth
def update_subscription():
    """Update subscription status"""
    try:
        user_id = g.user_id
        data = request.json
        
        # Update user subscription status
        user_update = {
            'subscription_status': data['status'],
            'subscription_plan': data.get('plan', 'premium'),
            'payment_reference': data.get('payment_reference')
        }
        
        result = supabase.table('users').update(user_update).eq('user_id', user_id).execute()
        
        if not result.data:
            return jsonify({'error': 'User not found'}), 404
            
        # Log subscription event
        supabase.table('subscription_events').insert({
            'user_id': user_id,
            'status': data['status'],
            'plan': data.get('plan', 'premium'),
            'payment_reference': data.get('payment_reference')
        }).execute()
        
        return jsonify({'success': True, 'data': result.data[0]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/share', methods=['POST'])
@require_auth
def share_item():
    """Share an item"""
    try:
        user_id = g.user_id
        data = request.json
        
        # Log share event
        share_data = {
            'user_id': user_id,
            'item_id': data['item_id'],
            'item_type': data['item_type'],
            'share_platform': data.get('share_platform', 'unknown')
        }
        
        result = supabase.table('share_events').insert(share_data).execute()
        return jsonify({'success': True, 'data': result.data[0]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/preferences/ads', methods=['PUT'])
@require_auth
def update_ads_preference():
    """Update ads preference"""
    try:
        user_id = g.user_id
        data = request.json
        
        result = supabase.table('users').update({
            'ads_opt_out': data.get('ads_opt_out', False)
        }).eq('user_id', user_id).execute()
        
        if not result.data:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify({'success': True, 'data': result.data[0]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
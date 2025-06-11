from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging
import sys
import datetime
from logging.handlers import RotatingFileHandler

# Create logs directory if it doesn't exist
os.makedirs('logs', exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
    handlers=[
        # Console handler
        logging.StreamHandler(sys.stdout),
        # File handler with rotation
        RotatingFileHandler(
            'logs/app.log',
            maxBytes=10000000,  # 10MB
            backupCount=5,
            encoding='utf-8'
        )
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

try:
    # Initialize Flask app
    app = Flask(__name__)
    CORS(app)

    # Import routes
    from routes.auth_routes import auth_bp
    from routes.user_routes import user_bp
    from routes.payment_routes import payment_bp
    from routes.analytics_routes import analytics_bp

    # Register blueprints with /api/v1 prefix
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(user_bp, url_prefix='/api/v1/user')
    app.register_blueprint(payment_bp, url_prefix='/api/v1/payment')
    app.register_blueprint(analytics_bp, url_prefix='/api/v1/analytics')

    # Request logging middleware
    @app.before_request
    def log_request():
        # Log request details
        logger.info(f"Request: {request.method} {request.path}")
        logger.debug(f"Headers: {dict(request.headers)}")
        logger.debug(f"Body: {request.get_data(as_text=True)}")
        logger.debug(f"Args: {dict(request.args)}")
        logger.debug(f"Remote Addr: {request.remote_addr}")

    # Response logging middleware
    @app.after_request
    def log_response(response):
        # Log response details
        logger.info(f"Response: {response.status}")
        logger.debug(f"Headers: {dict(response.headers)}")
        # Only log response body for non-success status codes
        if response.status_code >= 400:
            logger.debug(f"Body: {response.get_data(as_text=True)}")
        return response

    # Error logging
    @app.errorhandler(Exception)
    def handle_error(error):
        logger.error(f"Unhandled error: {str(error)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': {
                'message': 'An unexpected error occurred',
                'type': error.__class__.__name__,
                'details': str(error)
            }
        }), 500

    # Basic health check
    @app.route('/health')
    def health_check():
        logger.info("Health check requested")
        return jsonify({'status': 'ok'})

    # API version check
    @app.route('/api/v1/health')
    def api_health_check():
        logger.info("API health check requested")
        return jsonify({
            'status': 'ok',
            'version': 'v1',
            'timestamp': str(datetime.datetime.now())
        })

    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        logger.error(f"404 error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Resource not found',
            'path': request.path
        }), 404

    @app.errorhandler(500)
    def server_error(e):
        logger.error(f"500 error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Internal server error'
        }), 500

except Exception as e:
    logger.error(f"Failed to initialize app: {str(e)}", exc_info=True)
    raise

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port) 
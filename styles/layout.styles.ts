import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLogo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  loadingMessage: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 30,
  },
  progressBarContainer: {
    width: '80%',
    height: 8,
    backgroundColor: '#444444',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00C853',
  },
  loadingPercent: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 10,
  },
  // Daily Limit Popup Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  feedbackPopup: {
    width: width - 40,
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...(Platform.OS === 'web' ? { boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)' } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
    }),
    elevation: 10,
  },
  popupContainer: {
    width: width - 40,
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)' } : {
      elevation: 10,
    }),
  },
  popupHeader: {
    padding: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
    flex: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  starButton: {
    padding: 5,
  },
  submitFeedback: {
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDisabled: {
    backgroundColor: '#E0E0E0',
  },
  submitFeedbackText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  limitReachedContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  limitReachedText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 10,
  },
  limitDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  popupContent: {
    padding: 20,
  },
  upgradeInfoContainer: {
    marginBottom: 20,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202026',
    marginBottom: 8,
    textAlign: 'center',
  },
  upgradeDescription: {
    fontSize: 14,
    color: '#6A6A6A',
    textAlign: 'center',
    lineHeight: 20,
  },
  watchAdButton: {
    backgroundColor: '#202026',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  watchAdButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  limitedAccessButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  limitedAccessText: {
    fontSize: 14,
    color: '#6A6A6A',
  },
  
  // Feedback Popup Styles
  feedbackHeader: {
    padding: 20,
    position: 'relative',
    alignItems: 'center',
  },
  feedbackCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  feedbackTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202026',
    marginTop: 10,
    marginBottom: 10,
  },
  feedbackSubtitle: {
    fontSize: 14,
    color: '#6A6A6A',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  starButton: {
    marginHorizontal: 8,
  },
  submitFeedbackButton: {
    backgroundColor: '#202026',
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitFeedbackText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: 'rgba(32, 32, 38, 0.7)',
  },
});

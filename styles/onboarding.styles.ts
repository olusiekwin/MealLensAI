import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    height: height * 0.55,
    width: width,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  welcomeText: {
    position: 'absolute',
    width: 200,
    top: height * 0.23,
    alignSelf: 'center',
    fontWeight: '500',
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.89)',
  },
  cameraFrame: {
    position: 'absolute',
    width: 198,
    height: 194,
    top: height * 0.11,
    alignSelf: 'center',
  },
  corner: {
    position: 'absolute',
    width: 45,
    height: 40,
  },
  horizontalLine: {
    width: 45,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
  },
  verticalLine: {
    position: 'absolute',
    width: 3,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    transform: [{ rotate: '90deg' }],
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    transform: [{ rotate: '-90deg' }],
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    transform: [{ rotate: '180deg' }],
  },
  contentCard: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.55,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: 'center',
  },
  headingText: {
    width: 304,
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 27,
    textAlign: 'center',
    color: '#000000',
    marginBottom: 18,
  },
  descriptionText: {
    width: 287,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: '#6A6A6A',
  },
  paginationContainer: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 15,
    backgroundColor: '#B5B5B5',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#202026',
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    width: 320,
    height: 61,
    backgroundColor: '#202026',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});
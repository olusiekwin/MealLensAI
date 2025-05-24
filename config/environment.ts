// Environment configuration
export const environment = {
  production: false,
  // Add your environment variables here
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  // Add other environment-specific variables as needed
};

export default environment;

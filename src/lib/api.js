// API Configuration with environment support
const getApiBaseUrl = () => {
  // Get the base URL from environment variable
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (baseUrl) {
    // If production (contains onrender.com), add /api suffix
    // If local development, use as-is
    const isProduction =
      baseUrl.includes("onrender.com") ||
      baseUrl.includes("vercel.app") ||
      baseUrl.includes("netlify.app");

    return isProduction ? `${baseUrl}/api` : baseUrl;
  }

  // Fallback for development
  return "http://localhost:3000";
};

const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  POSTS: `${API_BASE_URL}/posts`,
  EVENTS: `${API_BASE_URL}/events`,
  MDAS: `${API_BASE_URL}/mdas`,
  COMMENTS: `${API_BASE_URL}/comments`,
  USERS: `${API_BASE_URL}/users`,
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
};

// Debug logging in development
if (import.meta.env.DEV) {
  console.log("API Configuration:", {
    API_BASE_URL,
    endpoints: API_ENDPOINTS,
  });
}

// API Configuration with environment support
const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
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

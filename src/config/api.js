// API Configuration for Next.js
const getApiBaseUrl = () => {
  // In Next.js, API routes are served from the same server
  // Use current domain with /api prefix
  const isServer = typeof window === "undefined";

  if (isServer) {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "https://betterkaduna.com";
  } else {
    // Client-side: use current domain + /api
    return window.location.origin;
  }
};

const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  POSTS: `${API_BASE_URL}/api/posts`,
  EVENTS: `${API_BASE_URL}/api/events`,
  MDAS: `${API_BASE_URL}/api/mdas`,
  COMMENTS: `${API_BASE_URL}/api/comments`,
  USERS: `${API_BASE_URL}/api/users`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
};

// Debug logging in development
if (process.env.NODE_ENV === "development") {
  console.log("API Configuration:", {
    API_BASE_URL,
    endpoints: API_ENDPOINTS,
  });
}

// API Service for Next.js frontend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const apiService = {
  // Generic GET request
  async get(endpoint, params = {}) {
    try {
      const url = new URL(endpoint, API_BASE_URL);
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  },

  // Generic POST request
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  },

  // Generic PUT request
  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error);
      throw error;
    }
  },

  // Generic DELETE request
  async delete(endpoint, id) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error(`Error deleting from ${endpoint}/${id}:`, error);
      throw error;
    }
  },

  // Specific service methods for posts
  getPosts: (page = 1, limit = 10) =>
    apiService.get("/api/posts", { page, limit }),
  getPost: (id) => apiService.get(`/api/posts/${id}`),
  createPost: (data) => apiService.post("/api/posts", data),
  updatePost: (id, data) => apiService.put(`/api/posts/${id}`, data),
  deletePost: (id) => apiService.delete("/api/posts", id),

  // Specific service methods for events
  getEvents: (page = 1, limit = 10) =>
    apiService.get("/api/events", { page, limit }),
  getEvent: (id) => apiService.get(`/api/events/${id}`),
  createEvent: (data) => apiService.post("/api/events", data),
  updateEvent: (id, data) => apiService.put(`/api/events/${id}`, data),
  deleteEvent: (id) => apiService.delete("/api/events", id),

  // Specific service methods for MDAs
  getMDAs: (page = 1, limit = 10) =>
    apiService.get("/api/mdas", { page, limit }),
  getMDA: (id) => apiService.get(`/api/mdas/${id}`),
  createMDA: (data) => apiService.post("/api/mdas", data),
  updateMDA: (id, data) => apiService.put(`/api/mdas/${id}`, data),
  deleteMDA: (id) => apiService.delete("/api/mdas", id),

  // Specific service methods for comments
  getComments: (params = {}) => apiService.get("/api/comments", params),
  createComment: (data) => apiService.post("/api/comments", data),
  updateComment: (id, data) => apiService.put(`/api/comments/${id}`, data),
  deleteComment: (id) => apiService.delete("/api/comments", id),

  // Specific service methods for users
  getUsers: () => apiService.get("/api/users"),
  getUser: (id) => apiService.get(`/api/users/${id}`),
  createUser: (data) => apiService.post("/api/users", data),
  updateUser: (id, data) => apiService.put(`/api/users/${id}`, data),
  deleteUser: (id) => apiService.delete("/api/users", id),

  // Auth methods
  login: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  register: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },
};

export default apiService;

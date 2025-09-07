import axios from "axios";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api";

const apiService = {
  // Generic GET request with retry logic
  async get(endpoint, params = {}, retries = 2) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await axios.get(endpoint, { params });
        return response.data;
      } catch (error) {
        console.error(
          `Error fetching from ${endpoint} (attempt ${attempt + 1}):`,
          error
        );

        if (attempt === retries) {
          const errorMessage =
            error.response?.data?.error || "Failed to load data";
          toast.error(errorMessage, { autoClose: 3000 });
          throw error;
        }

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  },

  // Generic POST request
  async post(endpoint, data) {
    try {
      const response = await axios.post(endpoint, data);
      toast.success("Created successfully", { autoClose: 2000 });
      return response.data;
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      toast.error("Failed to create", { autoClose: 3000 });
      throw error;
    }
  },

  // Generic PUT request
  async put(endpoint, data) {
    try {
      const response = await axios.put(endpoint, data);
      toast.success("Updated successfully", { autoClose: 2000 });
      return response.data;
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error);
      toast.error("Failed to update", { autoClose: 3000 });
      throw error;
    }
  },

  // Generic DELETE request
  async delete(endpoint, id) {
    try {
      await axios.delete(`${endpoint}/${id}`);
      toast.success("Deleted successfully", { autoClose: 2000 });
      return true;
    } catch (error) {
      console.error(`Error deleting from ${endpoint}/${id}:`, error);
      toast.error("Failed to delete", { autoClose: 3000 });
      throw error;
    }
  },

  // Specific service methods for posts
  getPosts: (page = 1, limit = 10) =>
    apiService.get(API_ENDPOINTS.POSTS, { _page: page, _limit: limit }),
  getPost: (id) => apiService.get(`${API_ENDPOINTS.POSTS}/${id}`),
  createPost: (data) => apiService.post(API_ENDPOINTS.POSTS, data),
  updatePost: (id, data) =>
    apiService.put(`${API_ENDPOINTS.POSTS}/${id}`, data),
  deletePost: (id) => apiService.delete(API_ENDPOINTS.POSTS, id),

  // Specific service methods for events
  getEvents: (page = 1, limit = 10) =>
    apiService.get(API_ENDPOINTS.EVENTS, { _page: page, _limit: limit }),
  getEvent: (id) => apiService.get(`${API_ENDPOINTS.EVENTS}/${id}`),
  createEvent: (data) => apiService.post(API_ENDPOINTS.EVENTS, data),
  updateEvent: (id, data) =>
    apiService.put(`${API_ENDPOINTS.EVENTS}/${id}`, data),
  deleteEvent: (id) => apiService.delete(API_ENDPOINTS.EVENTS, id),

  // Specific service methods for MDAs
  getMDAs: (page = 1, limit = 10) =>
    apiService.get(API_ENDPOINTS.MDAS, { _page: page, _limit: limit }),
  getMDA: (id) => apiService.get(`${API_ENDPOINTS.MDAS}/${id}`),
  createMDA: (data) => apiService.post(API_ENDPOINTS.MDAS, data),
  updateMDA: (id, data) => apiService.put(`${API_ENDPOINTS.MDAS}/${id}`, data),
  deleteMDA: (id) => apiService.delete(API_ENDPOINTS.MDAS, id),

  // Specific service methods for comments
  getComments: (params = {}) => apiService.get(API_ENDPOINTS.COMMENTS, params),
  getComment: (id) => apiService.get(`${API_ENDPOINTS.COMMENTS}/${id}`),
  createComment: (data) => {
    try {
      const response = apiService.post(API_ENDPOINTS.COMMENTS, {
        ...data,
        parentId: data.parentId || null, // Ensure parentId is included
      });
      return response;
    } catch (error) {
      console.error("Comment creation error:", error);
      toast.error("Failed to submit comment", { autoClose: 3000 });
      throw error;
    }
  },
  updateComment: (id, data) =>
    apiService.put(`${API_ENDPOINTS.COMMENTS}/${id}`, data),
  deleteComment: (id) => apiService.delete(API_ENDPOINTS.COMMENTS, id),

  // Specific service methods for users
  getUsers: () => apiService.get(API_ENDPOINTS.USERS),
  getUser: (id) => apiService.get(`${API_ENDPOINTS.USERS}/${id}`),
  createUser: (data) => apiService.post(API_ENDPOINTS.USERS, data),
  updateUser: (id, data) =>
    apiService.put(`${API_ENDPOINTS.USERS}/${id}`, data),
  deleteUser: (id) => apiService.delete(API_ENDPOINTS.USERS, id),

  login: async (data) => {
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, data);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Invalid email or password", { autoClose: 3000 });
      throw error;
    }
  },
  register: async (data) => {
    try {
      const response = await axios.post(API_ENDPOINTS.REGISTER, data);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.error || "Registration failed", {
        autoClose: 3000,
      });
      throw error;
    }
  },
};

export default apiService;

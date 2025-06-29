import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Authentication service
const AuthService = {
  login: async (username, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
      username,
      password
    });
    if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (username, email, password, fullName, enrollmentDate, roles = ["user"]) => {
    return await axios.post(`${API_BASE_URL}/auth/signup`, {
      username,
      email,
      password,
      fullName,
      enrollmentDate,
      role: roles
    });
  },

  logout: () => {
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getAuthHeader: () => {
    const user = AuthService.getCurrentUser();
    if (user && user.accessToken) {
      return { Authorization: "Bearer " + user.accessToken };
    }
    return {};
  }
};

// Configure axios interceptor for authentication
axios.interceptors.request.use(
  (config) => {
    const user = AuthService.getCurrentUser();
    if (user && user.accessToken) {
      config.headers.Authorization = "Bearer " + user.accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default AuthService;

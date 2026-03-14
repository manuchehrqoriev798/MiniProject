// API Service for Student Interface
// Base URL configuration - can be updated for different environments
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 10000; // 10 seconds default timeout
  }

  // Helper method for making API requests with timeout
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      config.signal = controller.signal;

      const response = await fetch(url, config);
      
      // Clear timeout if request completes
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        let errorData;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            // If not JSON, get text and check if it's HTML
            const text = await response.text();
            if (text.includes('<!DOCTYPE') || text.includes('<html')) {
              errorData = { message: 'Server returned HTML instead of JSON - backend may not be running' };
            } else {
              errorData = { message: text || response.statusText || `HTTP error! status: ${response.status}` };
            }
          }
        } catch (parseError) {
          errorData = { message: response.statusText || `HTTP error! status: ${response.status}` };
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          throw new Error('Server returned HTML instead of JSON - backend may not be running');
        }
        throw new Error('Server returned non-JSON response');
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      
      // Handle different types of errors
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Exam endpoints
  async getExamInstructions() {
    return this.request('/exam/instructions');
  }

  async getExamQuestions() {
    return this.request('/exam/questions');
  }

  async startExam() {
    return this.request('/exam/start', {
      method: 'POST',
    });
  }

  async submitExam(examData) {
    return this.request('/exam/submit', {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  }

  async getExamSession(sessionId) {
    return this.request(`/exam/session/${sessionId}`);
  }

  async updateExamProgress(sessionId, progressData) {
    return this.request(`/exam/session/${sessionId}/progress`, {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });
  }

  // Results and reports endpoints
  async getExamResults(examId) {
    return this.request(`/results/${examId}`);
  }

  async getStudentResults(studentId) {
    return this.request(`/results/student/${studentId}`);
  }

  async generateReport(examId) {
    return this.request(`/reports/${examId}/generate`, {
      method: 'POST',
    });
  }

  async downloadReport(examId, format = 'pdf') {
    const response = await fetch(`${this.baseURL}/reports/${examId}/download?format=${format}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download report');
    }

    return response.blob();
  }

  // Student profile endpoints
  async getStudentProfile() {
    return this.request('/student/profile');
  }

  async updateStudentProfile(profileData) {
    return this.request('/student/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getStudentExamHistory() {
    return this.request('/student/exams');
  }

  // Utility methods
  async healthCheck() {
    return this.request('/health');
  }

  async getServerTime() {
    return this.request('/time');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

export default apiService;

// Export individual methods for easier importing
export const {
  login,
  signup,
  logout,
  getCurrentUser,
  getExamInstructions,
  getExamQuestions,
  startExam,
  submitExam,
  getExamSession,
  updateExamProgress,
  getExamResults,
  getStudentResults,
  generateReport,
  downloadReport,
  getStudentProfile,
  updateStudentProfile,
  getStudentExamHistory,
  healthCheck,
  getServerTime,
} = apiService;

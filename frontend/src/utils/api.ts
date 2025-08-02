import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse, ApiResponse, SessionsResponse, Session, LoginCredentials, RegisterCredentials, SessionFormData } from '@/types';

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      timeout: 60000, // Increased to 60 seconds for Render cold starts
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Enable credentials for CORS
    });

    // Request interceptor to add auth token and debug info
    this.api.interceptors.request.use(
      (config) => {
        console.log('API Request:', {
          url: config.url,
          method: config.method,
          baseURL: config.baseURL,
          fullURL: `${config.baseURL}${config.url}`
        });
        
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log('API Response Success:', {
          url: response.config.url,
          status: response.status,
          data: response.data
        });
        return response;
      },
      (error) => {
        console.error('API Response Error:', {
          url: error.config?.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          code: error.code
        });
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { confirmPassword, ...registerData } = credentials;
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', registerData);
    return response.data;
  }

  async getMe(): Promise<ApiResponse<{ user: any }>> {
    const response: AxiosResponse<ApiResponse<{ user: any }>> = await this.api.get('/auth/me');
    return response.data;
  }

  // Session endpoints
  async getPublicSessions(page = 1, limit = 10): Promise<ApiResponse<SessionsResponse>> {
    const response: AxiosResponse<ApiResponse<SessionsResponse>> = await this.api.get(
      `/sessions?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getMySessions(): Promise<ApiResponse<SessionsResponse>> {
    const response: AxiosResponse<ApiResponse<SessionsResponse>> = await this.api.get('/my-sessions');
    return response.data;
  }

  async getSession(id: string): Promise<ApiResponse<{ session: Session }>> {
    const response: AxiosResponse<ApiResponse<{ session: Session }>> = await this.api.get(`/my-sessions/${id}`);
    return response.data;
  }

  async saveDraft(sessionData: SessionFormData): Promise<ApiResponse<{ session: Session }>> {
    const response: AxiosResponse<ApiResponse<{ session: Session }>> = await this.api.post(
      '/my-sessions/save-draft',
      sessionData
    );
    return response.data;
  }

  async publishSession(sessionData: SessionFormData): Promise<ApiResponse<{ session: Session }>> {
    const response: AxiosResponse<ApiResponse<{ session: Session }>> = await this.api.post(
      '/my-sessions/publish',
      sessionData
    );
    return response.data;
  }

  async updateSession(id: string, sessionData: SessionFormData): Promise<ApiResponse<{ session: Session }>> {
    const response: AxiosResponse<ApiResponse<{ session: Session }>> = await this.api.put(
      `/my-sessions/${id}`,
      sessionData
    );
    return response.data;
  }

  async deleteSession(id: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete(`/my-sessions/${id}`);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.api.get('/health');
    return response.data;
  }

  // Debug method to check configuration
  getApiConfig(): any {
    return {
      baseURL: import.meta.env.VITE_API_URL || '/api',
      fullHealthURL: `${import.meta.env.VITE_API_URL || '/api'}/health`,
      envVars: {
        VITE_API_URL: import.meta.env.VITE_API_URL,
        NODE_ENV: import.meta.env.NODE_ENV,
        MODE: import.meta.env.MODE
      }
    };
  }
}

export const apiClient = new ApiClient();
export default apiClient;

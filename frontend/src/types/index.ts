export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

export interface Session {
  _id: string;
  user_id: string | User;
  title: string;
  tags: string[];
  json_file_url: string;
  status: 'draft' | 'published';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface SessionsResponse {
  sessions: Session[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SessionFormData {
  id?: string;
  title: string;
  tags: string[];
  json_file_url: string;
  description?: string;
  status?: 'draft' | 'published';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ToastType {
  success: (message: string) => void;
  error: (message: string) => void;
  loading: (message: string) => string;
  dismiss: (toastId: string) => void;
}

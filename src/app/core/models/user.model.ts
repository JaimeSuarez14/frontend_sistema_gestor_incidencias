export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

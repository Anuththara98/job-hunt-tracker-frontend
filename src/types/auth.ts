export interface AuthUser {
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse extends AuthUser {
  token: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  displayName: string;
  createdAt: string | Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: UserData;
}

export interface UserInterface {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  displayName: string;
}

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

export const USER_ID_HEADER = 'x-user-id';

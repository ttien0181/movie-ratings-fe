export interface APIResponse<T> {
  status: string;
  result: T;
  errors?: ErrorDetail[];
}

export interface ErrorDetail {
  field: string;
  errorMessage: string;
  timestamp: string;
}

// --- Auth Types ---

export interface AuthRequest {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  verificationCode: string;
}

export interface SendVerificationCodeRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  verificationCode: string;
  newPassword: string;
}

// --- Domain Types ---

export interface GenreResponse {
  id: number;
  name: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface GenreRequest {
  name: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface MovieResponse {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  rating?: number;      // Float in backend (can be null)
  totalRate?: number;   // Integer in backend (can be null)
  genres: GenreResponse[]; // Many-to-Many relationship
  createdAt?: string;
  actors?: string;
  posterUrl?: string;   // New field from backend
}

export interface MovieRequest {
  title: string;
  description: string;
  releaseYear: number;
  genreIds: number[]; // List of IDs for creation
  actors: string;
  posterUrl?: string; // New field
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
  banned: boolean; // Added for Admin
  role?: 'USER' | 'ADMIN'; // Optional depending on backend DTO, useful for UI
}

export interface UserRequest {
  username: string;
  email: string;
  password?: string;
}

export interface ReviewResponse {
  id: number;
  userId: number;
  movieId: number;
  rating: number;
  content: string;
  createdAt?: string;
}

export interface ReviewRequest {
  userId: number;
  movieId: number;
  rating: number;
  content: string;
}

export interface CommentResponse {
  id: number;
  userId: number;
  reviewId: number;
  content: string;
  createdAt?: string;
}

export interface CommentRequest {
  userId: number;
  reviewId: number;
  content: string;
}
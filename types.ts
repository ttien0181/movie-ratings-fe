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

export interface GenreResponse {
  id: number;
  name: string;
  description?: string;
}

export interface GenreRequest {
  name: string;
  description?: string;
}

export interface MovieResponse {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  rating: number;      // Float in backend
  totalRate: number;   // Integer in backend
  genreId: number;     // Long in backend
  createdAt?: string;
  actors?: string;
  posterUrl?: string;  // Frontend only (mocked)
}

export interface MovieRequest {
  title: string;
  description: string;
  releaseYear: number;
  genreId: number;
  actors: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
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

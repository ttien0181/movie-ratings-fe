export interface APIResponse<T> {
  status: string;
  result: T;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  director: string;
  releaseYear: number;
  posterUrl?: string; // Optional in case backend doesn't have it yet, we can mock
  averageRating?: number; // Calculated by backend or frontend
  genre: Genre;
}

// DTO for creating/updating
export interface MovieRequest {
  title: string;
  description: string;
  director: string;
  releaseYear: number;
  genreId: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  // Password is not usually sent back
}

export interface UserRequest {
  username: string;
  email: string;
  password?: string;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  content: string;
  createdAt?: string; // ISO string
  movieId: number;
  userId: number;
  username?: string; // Helper if backend enriches it, else we fetch user
}

export interface ReviewRequest {
  content: string;
  rating: number;
  movieId: number;
  userId: number;
}

export interface CommentResponse {
  id: number;
  content: string;
  reviewId: number;
  userId: number;
  username?: string;
  createdAt?: string;
}

export interface CommentRequest {
  content: string;
  reviewId: number;
  userId: number;
}

export interface GenreRequest {
  name: string;
}

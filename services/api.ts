import { 
  APIResponse, MovieResponse, MovieRequest, GenreResponse, GenreRequest, 
  ReviewResponse, ReviewRequest, CommentResponse, CommentRequest, UserResponse, UserRequest 
} from '../types';

const BASE_URL = 'http://localhost:8080/movie-ratings/api';

// Helper to handle response
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  const data: APIResponse<T> = await response.json();
  if (data.status !== 'SUCCESS') {
    throw new Error(`Backend Error: ${data.status} - ${JSON.stringify(data.errors)}`);
  }
  return data.result;
}

export const movieService = {
  getAll: async (): Promise<MovieResponse[]> => {
    try {
      const res = await fetch(`${BASE_URL}/movies`);
      return handleResponse<MovieResponse[]>(res);
    } catch (e) {
      console.error("Failed to fetch movies", e);
      return [];
    }
  },
  getById: async (id: number): Promise<MovieResponse> => {
    const res = await fetch(`${BASE_URL}/movies/${id}`);
    return handleResponse<MovieResponse>(res);
  },
  search: async (keyword: string): Promise<MovieResponse[]> => {
    const res = await fetch(`${BASE_URL}/movies/search?keyword=${encodeURIComponent(keyword)}`);
    return handleResponse<MovieResponse[]>(res);
  },
  getByGenre: async (genreId: number): Promise<MovieResponse[]> => {
    const res = await fetch(`${BASE_URL}/movies/genre/${genreId}`);
    return handleResponse<MovieResponse[]>(res);
  },
  create: async (req: MovieRequest): Promise<MovieResponse> => {
    const res = await fetch(`${BASE_URL}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return handleResponse<MovieResponse>(res);
  }
};

export const genreService = {
  getAll: async (): Promise<GenreResponse[]> => {
    try {
      const res = await fetch(`${BASE_URL}/genres`);
      return handleResponse<GenreResponse[]>(res);
    } catch (e) {
      console.error("Failed to fetch genres", e);
      return [];
    }
  },
  getById: async (id: number): Promise<GenreResponse> => {
    const res = await fetch(`${BASE_URL}/genres/${id}`);
    return handleResponse<GenreResponse>(res);
  },
  create: async (req: GenreRequest): Promise<GenreResponse> => {
    const res = await fetch(`${BASE_URL}/genres`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return handleResponse<GenreResponse>(res);
  }
};

export const reviewService = {
  getByMovie: async (movieId: number): Promise<ReviewResponse[]> => {
    try {
      const res = await fetch(`${BASE_URL}/reviews/movie/${movieId}`);
      return handleResponse<ReviewResponse[]>(res);
    } catch (e) {
      return [];
    }
  },
  create: async (req: ReviewRequest): Promise<ReviewResponse> => {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return handleResponse<ReviewResponse>(res);
  }
};

export const commentService = {
  getByReview: async (reviewId: number): Promise<CommentResponse[]> => {
    const res = await fetch(`${BASE_URL}/comments/review/${reviewId}`);
    return handleResponse<CommentResponse[]>(res);
  },
  create: async (req: CommentRequest): Promise<CommentResponse> => {
    const res = await fetch(`${BASE_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return handleResponse<CommentResponse>(res);
  }
};

export const userService = {
    create: async (req: UserRequest): Promise<UserResponse> => {
        const res = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
        });
        return handleResponse<UserResponse>(res);
    },
    getAll: async (): Promise<UserResponse[]> => {
        const res = await fetch(`${BASE_URL}/users`);
        return handleResponse<UserResponse[]>(res);
    }
}

import { 
  APIResponse, MovieResponse, MovieRequest, GenreResponse, GenreRequest, 
  ReviewResponse, ReviewRequest, CommentResponse, CommentRequest, UserResponse, UserRequest,
  AuthRequest, AuthResponse, RegisterRequest, SendVerificationCodeRequest, ForgotPasswordRequest, ResetPasswordRequest,
  ErrorDetail
} from '../types';

const BASE_URL = 'http://localhost:8080/movie-ratings/api';

// Custom Error Class to hold structured backend errors
export class ApiError extends Error {
  public errors: ErrorDetail[];

  constructor(message: string, errors: ErrorDetail[] = []) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
  }
}

// Helper to get token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper to handle response
async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: APIResponse<T>;

  try {
    data = JSON.parse(text);
  } catch (e) {
    // If response is not JSON
    if (!response.ok) {
      throw new Error(`Request failed (${response.status}): ${text || response.statusText}`);
    }
    // If 200 OK but not JSON (shouldn't happen with this API structure)
    throw new Error(`Invalid response format`);
  }

  // Check API Status
  if (data.status === 'SUCCESS') {
    return data.result;
  }

  // Handle API Error
  const errorDetails: ErrorDetail[] = data.errors || [];
  let message = data.status || 'Operation Failed';
  
  if (errorDetails.length > 0) {
    // Construct a summary message from the first few errors
    message = errorDetails.map(e => e.errorMessage).join('; ');
  } else if (typeof data.result === 'string') {
    // Fallback if result contains error message
    message = data.result;
  }

  throw new ApiError(message, errorDetails);
}

export const authService = {
  login: async (req: AuthRequest): Promise<AuthResponse> => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return handleResponse<AuthResponse>(res);
  },

  sendVerificationCode: async (req: SendVerificationCodeRequest): Promise<string> => {
    const res = await fetch(`${BASE_URL}/auth/send-verification-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return handleResponse<string>(res);
  },

  register: async (req: RegisterRequest): Promise<string> => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return handleResponse<string>(res);
  },

  sendForgotPasswordCode: async (req: ForgotPasswordRequest): Promise<string> => {
    const res = await fetch(`${BASE_URL}/auth/forgot-password/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return handleResponse<string>(res);
  },

  resetPassword: async (req: ResetPasswordRequest): Promise<string> => {
    const res = await fetch(`${BASE_URL}/auth/forgot-password/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return handleResponse<string>(res);
  }
};

export const movieService = {
  getAll: async (): Promise<MovieResponse[]> => {
    try {
      const res = await fetch(`${BASE_URL}/movies`, {
        headers: getAuthHeaders()
      });
      return handleResponse<MovieResponse[]>(res);
    } catch (e) {
      console.error("Failed to fetch movies", e);
      return [];
    }
  },
  getById: async (id: number): Promise<MovieResponse> => {
    const res = await fetch(`${BASE_URL}/movies/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<MovieResponse>(res);
  },
  search: async (keyword: string): Promise<MovieResponse[]> => {
    const res = await fetch(`${BASE_URL}/movies/search?keyword=${encodeURIComponent(keyword)}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<MovieResponse[]>(res);
  },
  getByGenre: async (genreId: number): Promise<MovieResponse[]> => {
    const res = await fetch(`${BASE_URL}/movies/genre/${genreId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<MovieResponse[]>(res);
  },
  create: async (req: MovieRequest): Promise<MovieResponse> => {
    const res = await fetch(`${BASE_URL}/movies`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(req),
    });
    return handleResponse<MovieResponse>(res);
  }
};

export const genreService = {
  getAll: async (): Promise<GenreResponse[]> => {
    try {
      const res = await fetch(`${BASE_URL}/genres`, {
        headers: getAuthHeaders()
      });
      return handleResponse<GenreResponse[]>(res);
    } catch (e) {
      console.error("Failed to fetch genres", e);
      return [];
    }
  },
  getById: async (id: number): Promise<GenreResponse> => {
    const res = await fetch(`${BASE_URL}/genres/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<GenreResponse>(res);
  },
  create: async (req: GenreRequest): Promise<GenreResponse> => {
    const res = await fetch(`${BASE_URL}/genres`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(req),
    });
    return handleResponse<GenreResponse>(res);
  }
};

export const reviewService = {
  getByMovie: async (movieId: number): Promise<ReviewResponse[]> => {
    try {
      const res = await fetch(`${BASE_URL}/reviews/movie/${movieId}`, {
        headers: getAuthHeaders()
      });
      return handleResponse<ReviewResponse[]>(res);
    } catch (e) {
      return [];
    }
  },
  getByUser: async (userId: number): Promise<ReviewResponse[]> => {
    try {
      const res = await fetch(`${BASE_URL}/reviews/user/${userId}`, {
        headers: getAuthHeaders()
      });
      return handleResponse<ReviewResponse[]>(res);
    } catch (e) {
      return [];
    }
  },
  create: async (req: ReviewRequest): Promise<ReviewResponse> => {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(req),
    });
    return handleResponse<ReviewResponse>(res);
  }
};

export const commentService = {
  getByReview: async (reviewId: number): Promise<CommentResponse[]> => {
    const res = await fetch(`${BASE_URL}/comments/review/${reviewId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<CommentResponse[]>(res);
  },
  create: async (req: CommentRequest): Promise<CommentResponse> => {
    const res = await fetch(`${BASE_URL}/comments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(req),
    });
    return handleResponse<CommentResponse>(res);
  }
};

export const userService = {
    create: async (req: UserRequest): Promise<UserResponse> => {
        const res = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(req),
        });
        return handleResponse<UserResponse>(res);
    },
    getAll: async (): Promise<UserResponse[]> => {
        const res = await fetch(`${BASE_URL}/users`, {
            headers: getAuthHeaders()
        });
        return handleResponse<UserResponse[]>(res);
    }
}
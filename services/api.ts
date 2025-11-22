import { 
  APIResponse, Movie, MovieRequest, Genre, GenreRequest, 
  ReviewResponse, ReviewRequest, CommentResponse, CommentRequest, User, UserRequest 
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
    throw new Error(`Backend Error: ${data.status}`);
  }
  return data.result;
}

export const movieService = {
  getAll: async (): Promise<Movie[]> => {
    try {
      const res = await fetch(`${BASE_URL}/movies`);
      return handleResponse<Movie[]>(res);
    } catch (e) {
      console.error("Failed to fetch movies, using mock data for demo", e);
      return MOCK_MOVIES;
    }
  },
  getById: async (id: number): Promise<Movie> => {
    const res = await fetch(`${BASE_URL}/movies/${id}`);
    return handleResponse<Movie>(res);
  },
  search: async (keyword: string): Promise<Movie[]> => {
    const res = await fetch(`${BASE_URL}/movies/search?keyword=${encodeURIComponent(keyword)}`);
    return handleResponse<Movie[]>(res);
  },
  getByGenre: async (genreId: number): Promise<Movie[]> => {
    const res = await fetch(`${BASE_URL}/movies/genre/${genreId}`);
    return handleResponse<Movie[]>(res);
  },
  create: async (req: MovieRequest): Promise<Movie> => {
    const res = await fetch(`${BASE_URL}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return handleResponse<Movie>(res);
  }
};

export const genreService = {
  getAll: async (): Promise<Genre[]> => {
    try {
      const res = await fetch(`${BASE_URL}/genres`);
      return handleResponse<Genre[]>(res);
    } catch (e) {
      return MOCK_GENRES;
    }
  },
  create: async (req: GenreRequest): Promise<Genre> => {
    const res = await fetch(`${BASE_URL}/genres`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    return handleResponse<Genre>(res);
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
    create: async (req: UserRequest): Promise<User> => {
        const res = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
        });
        return handleResponse<User>(res);
    },
    getAll: async (): Promise<User[]> => {
        const res = await fetch(`${BASE_URL}/users`);
        return handleResponse<User[]>(res);
    }
}

// --- MOCK DATA (Fallback if backend is not running) ---
const MOCK_GENRES: Genre[] = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Sci-Fi' },
  { id: 3, name: 'Drama' },
  { id: 4, name: 'Horror' },
  { id: 5, name: 'Comedy' },
];

const MOCK_MOVIES: Movie[] = [
  { id: 1, title: 'Inception', description: 'A thief who steals corporate secrets through the use of dream-sharing technology.', director: 'Christopher Nolan', releaseYear: 2010, genre: MOCK_GENRES[1], averageRating: 4.8 },
  { id: 2, title: 'The Dark Knight', description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.', director: 'Christopher Nolan', releaseYear: 2008, genre: MOCK_GENRES[0], averageRating: 4.9 },
  { id: 3, title: 'Interstellar', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', director: 'Christopher Nolan', releaseYear: 2014, genre: MOCK_GENRES[1], averageRating: 4.7 },
  { id: 4, title: 'Parasite', description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', director: 'Bong Joon Ho', releaseYear: 2019, genre: MOCK_GENRES[2], averageRating: 4.6 },
];

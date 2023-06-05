import { QueryResult } from "pg";

interface Movie {
    id: number;
    name: string;
    category: string;
    duration: number;
    price: number;
}

type MovieRequest = Omit<Movie, "id">;

type MovieUpdateRequest = Partial<MovieRequest>;

type MovieResult = QueryResult<Movie>;

export { Movie, MovieRequest, MovieUpdateRequest, MovieResult };
import { Request, Response } from "express";
import format from "pg-format";
import { client } from "./database";
import { MovieRequest, MovieResult, MovieUpdateRequest } from "./interfaces";

const createMovie = async (req: Request, res: Response): Promise<Response> => {
    const payload: MovieRequest = req.body;

    const queryString: string = format(
        `
      INSERT INTO movies(%I)
      VALUES(%L)
      RETURNING *;
      `,
        Object.keys(payload),
        Object.values(payload)
    );

    const queryResult: MovieResult = await client.query(queryString);

    return res.status(201).json(queryResult.rows[0]);
};

const readMovies = async (req: Request, res: Response): Promise<Response> => {
    const queryStringCategory: string = `
      SELECT * FROM movies
      WHERE category = $1;
    `;

    const queryResultCategory: MovieResult = await client.query(
        queryStringCategory,
        [req.query.category]
    );

    if (queryResultCategory.rowCount > 0) {
        return res.status(200).json(queryResultCategory.rows);
    }

    const queryStringAll: string = `SELECT * FROM movies;`;
    const queryResultAll: MovieResult = await client.query(queryStringAll);

    return res.json(queryResultAll.rows);
};

const retrieveMovie = async (req: Request, res: Response): Promise<Response> => {
    const foundMovie = res.locals.queryResult;

    return res.status(200).json(foundMovie);
}

const updateMovie = async (req: Request, res: Response): Promise<Response> => {
    const payload: MovieUpdateRequest = req.body;

    const queryString: string = format(
        `
      UPDATE movies
      SET(%I) = ROW(%L)
      WHERE id = $1
      RETURNING *;
      `,
        Object.keys(payload),
        Object.values(payload)
    );

    const queryResult: MovieResult = await client.query(queryString, [
        req.params.id,
    ]);

    return res.status(200).json(queryResult.rows[0]);
};

const deleteMovie = async (req: Request, res: Response): Promise<Response> => {
    const queryString: string = `
      DELETE FROM movies
      WHERE id = $1;
    `;

    await client.query(queryString, [req.params.id]);

    return res.status(204).send();
};

export { createMovie, readMovies, updateMovie, deleteMovie, retrieveMovie }
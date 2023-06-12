import { NextFunction, Request, Response } from "express";
import { Movie, MovieResult } from "./interfaces";
import { client } from "./database";
import { QueryConfig } from "pg";

const verifyIdExistance = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const queryString: string = `
    SELECT * FROM "movies"
    WHERE id = $1;
  `;

    const queryResult: MovieResult = await client.query(queryString, [
        req.params.id,
    ]);

    if (queryResult.rowCount === 0) {
        return res.status(404).json({ error: "Movie not found!" });
    }

    res.locals.queryResult = queryResult.rows[0];

    return next();
};

const verifyNameExistance = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const { name } = req.body;

    const queryTemplate: string = 'SELECT * FROM "movies" WHERE name = $1;';

    const queryConfig: QueryConfig = {
        text: queryTemplate,
        values: [name],
    };

    const queryResult: MovieResult = await client.query(queryConfig);
    const foundMovie: Movie = queryResult.rows[0];

    if (foundMovie) {
        const message: string = "Movie name already exists!";
        return res.status(409).json({ message });
    }

    return next();
};

export { verifyIdExistance, verifyNameExistance };
import { NextFunction, Request, Response } from "express";
import { MovieResult } from "./interfaces";
import { client } from "./database";

const verifyIdExistance = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const queryString: string = `
    SELECT * FROM movies
    WHERE id = $1;
  `;

    const queryResult: MovieResult = await client.query(queryString, [
        req.params.id,
    ]);

    if (queryResult.rowCount === 0) {
        return res.status(404).json({ error: "Movie not found!" });
    }

    return next();
};

export { verifyIdExistance };
import express, { Application, json } from "express";
import "dotenv/config";
import { connectDatabase } from "./database";
import { createMovie, deleteMovie, updateMovie, readMovies } from "./logic";
import { verifyIdExistance } from "./middlewares";

const app: Application = express();
app.use(json());

app.post("/movies", createMovie);

app.get("/movies", readMovies);

app.get("/movies/:id", verifyIdExistance, readMovies);

app.patch("/movies/:id", verifyIdExistance, updateMovie);

app.delete("/movies/:id", verifyIdExistance, deleteMovie);

const PORT: number = 3000;
const runningMsg: string = `Server running on http://localhost:${PORT}`;
app.listen(PORT, async () => {
    await connectDatabase();
    console.log(runningMsg);
});
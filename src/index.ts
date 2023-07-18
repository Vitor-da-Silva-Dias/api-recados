import cors from "cors";
import express, { Request, Response } from "express";
import { appRoutes } from "./routes/user.routes";
import * as dotenv from "dotenv";
import { Database } from "./database/config/database.connection";
import "reflect-metadata";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", appRoutes());

Database.connect().then(() => {
    console.log("Database is connected!");

    app.listen(process.env.PORT, () => {
        console.log("Servidor rodando na porta " + process.env.PORT + "!");
    });
});

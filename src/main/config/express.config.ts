import cors from "cors";
import express from "express";
import { appRoutes } from "../../app/features/user/routes/user.routes";
import * as dotenv from "dotenv";

export const createApp = () => {
    dotenv.config();

    const app = express();
    app.use(express.json());
    app.use(cors());

    app.use("/users", appRoutes());    
    
    return app;
}

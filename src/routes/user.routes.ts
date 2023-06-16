import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export const appRoutes = () => {
    const app = Router();

    app.get("/", new UserController().getAllUsers);

    return app;
};
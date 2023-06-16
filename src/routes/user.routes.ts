import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export const appRoutes = () => {
    const app = Router();

    app.get("/", new UserController().getAllUsers);
    app.post("/", new UserController().createUser);
    app.put("/:id", new UserController().updateUser);
    app.delete("/:id", new UserController().deleteUser);

    return app;
};
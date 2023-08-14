import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { errandRoutes } from "../../errand/routes/errand.routes";

export const appRoutes = () => {
    const app = Router();

    app.get("/", new UserController().getAllUsers);
    app.post("/", new UserController().createUser);
    app.put("/:id", new UserController().updateUser);
    app.delete("/:id", new UserController().deleteUser);
    app.post("/login", new UserController().login);

    app.use("/:userId/errands", errandRoutes());

    return app;
};
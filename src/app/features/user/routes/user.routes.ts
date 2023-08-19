import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { errandRoutes } from "../../errand/routes/errand.routes";

export const appRoutes = () => {
    const app = Router();

    app.get("/", new UserController().listUser);
    app.post("/", new UserController().createUser);
    app.put("/:userId", new UserController().updateUser);
    app.delete("/:userId", new UserController().deleteUser);
    app.post("/login", new UserController().login);

    app.use("/:userId/errands", errandRoutes());

    return app;
};
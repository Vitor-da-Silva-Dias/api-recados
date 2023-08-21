import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { errandRoutes } from "../../errand/routes/errand.routes";
import { UserValidator } from "../validators/user.validator";

export const appRoutes = () => {
    const app = Router();

    app.get("/", new UserController().listUser);
    app.post("/", UserValidator.createUserValidator, new UserController().createUser);
    app.put("/:userId", UserValidator.updateUserValidator, new UserController().updateUser);
    app.delete("/:userId", new UserController().deleteUser);
    app.post("/login", UserValidator.loginValidator, new UserController().login);

    app.use("/:userId/errands", errandRoutes());

    return app;
};
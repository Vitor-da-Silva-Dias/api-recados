import { Router } from "express";
import { ErrandController } from "../controllers/errand.controller";


export const errandRoutes = () => {
    const app = Router({
        mergeParams: true,
    });

    const controller = new ErrandController();

    app.post("/", new ErrandController().createErrand);
    // app.get("/")
    app.put("/:errandId", new ErrandController().updateErrand);
    app.delete("/:errandId", new ErrandController().deleteErrand);

    return app;
}
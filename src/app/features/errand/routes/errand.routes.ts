import { Router } from "express";
import { ErrandController } from "../controllers/errand.controller";
import { ErrandValidator } from "../validators/errand.validator";



export const errandRoutes = () => {
    const app = Router({
        mergeParams: true,
    });


    app.post("/",ErrandValidator.createErrandValidator, new ErrandController().createErrand);
    app.get("/", new ErrandController().listErrand);
    app.put("/:errandId", ErrandValidator.updateErrandValidator, new ErrandController().updateErrand);
    app.delete("/:errandId", new ErrandController().deleteErrand);

    app.post("/:errandId/archive", new ErrandController().archiveErrand);
    app.post("/:errandId/unarchive", new ErrandController().unarchiveErrand);


    return app;
}
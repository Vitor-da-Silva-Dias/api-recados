import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpResponse } from "../../../shared/util/http-response.adapter";


export class ErrandValidator{
    public static createErrandValidator(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { description, detail} = req.body;

            if (!description) {
                return HttpResponse.fieldNotProvided(res, "description");
            }

            if (!detail) {
                return HttpResponse.fieldNotProvided(res, "detail");
            }

            next();
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
              ok: false,
              message: error.toString(),
            });
          }
    }
}

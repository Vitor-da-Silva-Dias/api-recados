import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


export class ErrandMiddleware {
    public static validateFieldsCreate(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { description, detail} = req.body;

            if (!description) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    ok: false,
                    message: "Description was not provided",
                  });
            }

            if (!detail) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    ok: false,
                    message: "Detail was not provided",
                  });
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

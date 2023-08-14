import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRepository } from "../repositories/user.repository";


export class UserMiddleware {
    public static validateUserExists(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { userId } = req.params;

            const user = new UserRepository().get(userId);
            if (!user) {
                return res
                  .status(StatusCodes.NOT_FOUND)
                  .send({ ok: false, message: "User was not found" });
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

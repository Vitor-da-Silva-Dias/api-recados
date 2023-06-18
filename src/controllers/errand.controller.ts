import { users } from "../data/users";
import { Request, Response } from "express";
import { Errand } from "../models/errand";
import { StatusCodes } from "http-status-codes";


export class ErrandController {
    public createErrand(req: Request, res: Response) {
      try {
        const { userId } = req.params;
        const { description, detail } = req.body;
  
        const user = users.find((user) => user.id === userId);
  
        if (!user) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "User was not found" });
        }
  
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
        
  
        const newErrand = new Errand(description, detail);
        user.errands?.push(newErrand);
  
        return res.status(StatusCodes.OK).send({
          ok: true,
          message: "Transaction were sucessfully listed",
          data: newErrand.toJson(),
        });
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          ok: false,
          message: error.toString(),
        });
      }
    }
}
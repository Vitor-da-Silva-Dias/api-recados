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
  
      const responsePayload = {
        ok: true,
        message: "Errand successfully added.",
        data: newErrand.toJson(),
      };
  
      return res.status(StatusCodes.OK).send(responsePayload);
    
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        ok: false,
        message: error.toString(),
      });
    }
  }
  

    public listErrand(req: Request, res: Response) {
      try {
        const { userId } = req.params;
  
        const user = users.find((user) => user.id === userId);
  
        if (!user) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "User was not found" });
        }
  
        const errands = user.errands.map((errands) =>
        errands.toJson()
      );
  
        return res.status(StatusCodes.OK).send({
          ok: true,
          message: "Errand was sucessfully listed",
          data: errands
        });
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          ok: false,
          message: error.toString(),
        });
      }
    }

    public updateErrand(req: Request, res: Response) {
      try {
        const { userId, errandId } = req.params;
        const { description, detail } = req.body;
  
        const user = users.find((user) => user.id === userId);
  
        if (!user) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "User was not found" });
        }
  
        const ErrandIndex = user.errands.find(
          (errand) => errand.idErrand === errandId
        );
  
        if (!ErrandIndex) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "Errand was not found." });
        }
  
        if ( !description || !detail ) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .send({ ok: false, message: "Errand is invalid" });
        }
  
        ErrandIndex.description = description;
        ErrandIndex.detail = detail;
  
        return res
          .status(StatusCodes.CREATED)
          .send({ ok: true, message: "Errand was successfully updated" });
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          ok: false,
          message: error.toString(),
        });
      }
    }

    public deleteErrand(req: Request, res: Response) {
      try {
        const { userId, errandId } = req.params;
  
        const user = users.find((user) => user.id === userId);
  
        if (!user) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "User was not found." });
        }
  
        const ErrandIndex = user.errands.findIndex(
          (errand) => errand.idErrand === errandId
        );
          
        if (ErrandIndex === -1) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .send({ ok: false, message: "Errand was not found." });
        }
        
        
        const deletedErrand = user.errands.splice(ErrandIndex, 1);
  
        return res.status(StatusCodes.OK).send({
          ok: true,
          message: "Errand was deleted",
          data: deletedErrand[0].toJson(),
          });  
       
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          ok: false,
          message: error.toString(),
        });
      }
    }
}
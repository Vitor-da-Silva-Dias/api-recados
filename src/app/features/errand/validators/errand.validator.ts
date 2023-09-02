import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpResponse } from "../../../shared/util/http-response.adapter";


export class ErrandValidator{
    public static createErrandValidator (req: Request, res: Response, next: NextFunction) {
        try {
            const { description, detail} = req.body;

            if (!description) {
                return HttpResponse.badRequest(res, "Description not provided");
            }

            if (!detail) {
                return HttpResponse.badRequest(res, "Detail not provided");
            }

            next();
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
              ok: false,
              message: error.toString(),
            });
          }
    }

    public static async updateErrandValidator (req: Request, res: Response, next: NextFunction){
        try{
          const {description, detail} = req.body;
          
          if (!description && !detail) {
            return HttpResponse.badRequest(res, "Invalid update");
          }
    
          next();
    
        } catch (error: any) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
              ok: false,
              error: error.toString(),
          });
        } 
      }
}

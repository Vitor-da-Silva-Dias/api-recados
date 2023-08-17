import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { HttpResponse } from "../../../shared/util/http-response.adapter";
import { StatusCodes } from "http-status-codes";


export class UserValidator {

  public static loginValidator(req: Request, res: Response, next: NextFunction) {
      try {
      
          const {email, password} = req.body;

          if(!email || !password){
            return HttpResponse.unauthorized(res);
          }

          next();

      } catch (error: any) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
              ok: false,
              error: error.toString(),
          });
      }
  }

  public static async createUserValidator(req: Request, res: Response, next: NextFunction){
    try{
        const {name, email, password} = req.body;

        if(!name){
          return HttpResponse.fieldNotProvided(res, name);
        }

        if(!email){
          return HttpResponse.fieldNotProvided(res, email);
        }

        if(!password){
          return HttpResponse.fieldNotProvided(res, password);
        }

        const repository = new UserRepository();
    
        const emailValid = await repository.getByEmail(email);
  
        if (emailValid) {
          return HttpResponse.unauthorized(res)
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

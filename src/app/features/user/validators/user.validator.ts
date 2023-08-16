import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { JwtService } from "../../../shared/services/jwt.service";
import { HttpResponse } from "../../../shared/util/http-response.adapter";


export class UserValidator {

  public static loginValidator(req: Request, res: Response, next: NextFunction) {
      try {
      
          const token = req.headers.authorization;

          if (!token) {
              return HttpResponse.unauthorized(res);
          }

          const jwtService = new JwtService();
          const isValid = jwtService.verifyToken(token);

          if (!isValid) {
              return HttpResponse.unauthorized(res);
          }

          next();

      } catch (error: any) {
          return res.status(500).send({
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
        return res.status(500).send({
            ok: false,
            error: error.toString(),
        });
      }
  }

}

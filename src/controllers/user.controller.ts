import { users } from "../data/users";
import { Request, Response } from "express";
import { User } from "../models/user";
import { StatusCodes } from "http-status-codes";

export class UserController {
    //metodo
    public getAllUsers(req: Request, res: Response) {
      try {
        const { email, password } = req.query;
  
        let result = users;
  
        if (email) {
          result = users.filter((user) => user.email === email);
        }
        if (password) {
          result = users.filter((user) => user.password === password);
        }
  
        return res.status(StatusCodes.OK).send({
          ok: true,
          message: "Users were sucessfully listed",
          
          data: result.map((user) => {
            return {
              id: user.toJson().id,
              email: user.toJson().email,
              password: user.toJson().password,
            };
          }),
        });
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          ok: false,
          message: error.toString(),
        });
      }
    }
}
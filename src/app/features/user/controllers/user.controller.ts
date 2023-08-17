import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRepository } from "../repositories/user.repository";
import { ListUserUsecase } from "../usecases/list-user.usecase";
import { createUserUsecase } from "../usecases/create-user.usecase";
import { LoginUsecase } from "../usecases/login-usecase";

export class UserController {
    public async list(req: Request, res: Response) {
      try {
            
          const usecase = new ListUserUsecase();
          const result = await usecase.execute();
        
          return res.status(StatusCodes.OK).send({
          res, 
          result
        });
      } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          ok: false,
          message: error.toString(),
        });
      }
    }

    public async createUser(req: Request, res: Response) {
        try {
          const { name, email, password } = req.body;
          const usecase = new createUserUsecase();
    
          const result = await usecase.execute ({name, email, password});
    

          return res.status(StatusCodes.OK).send({
            res, 
            result
          });

        } catch (error: any) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            ok: false,
            message: error.toString(),
          });
        }
      }

      public async updateUser(req: Request, res: Response) {
        try {
          const { id } = req.params;
          const { email } = req.body;
          const { password } = req.body;  
    
          const repository = new UserRepository();
          const user = await repository.get(id)
          
          if (!user) {
            return res
              .status(StatusCodes.NOT_FOUND)
              .send({ ok: false, message: "User was not found" });
          }
    
          if (email) {
            user.email = email;
          }

          if (password) {
            user.password = password;
          }
    
          await repository.update(user);

          return res
            .status(StatusCodes.OK)
            .send({ ok: true, message: "User have been updated successfully" });
        } catch (error: any) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            ok: false,
            message: error.toString(),
          });
        }
      }

      public async deleteUser(req: Request, res: Response) {
        try {
          const { id } = req.params;
    
          const userRepository = new UserRepository();
          const deletedUser = await userRepository.delete(id);

          if (deletedUser == 0) {
            return res
              .status(StatusCodes.NOT_FOUND)
              .send({ ok: false, message: "User was not found" });
          }
    
          return res.status(StatusCodes.OK).send({
            ok: true,
            message: "user was successfully deleted"    
          });
        } catch (error: any) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            ok: false,
            message: error.toString(),
          });
        }
      }

      public async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const usecase = new LoginUsecase();
            const result = await usecase.execute({email, password});

            return res.status(StatusCodes.OK).send({
              res, 
              result
            });
          
        } catch (error: any) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            ok: false,
            message: error.toString(),
          });
        }
    }
    
  }
      

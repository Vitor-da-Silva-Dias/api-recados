import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ListUserUsecase } from "../usecases/list-user.usecase";
import { createUserUsecase } from "../usecases/create-user.usecase";
import { LoginUsecase } from "../usecases/login.usecase";
import { updateUserUsecase } from "../usecases/update-user.usecase";
import { deleteUserUsecase } from "../usecases/delete-user.usecase";

export class UserController {
    public async listUser(req: Request, res: Response) {
      try {
            
          const usecase = new ListUserUsecase();
          const result = await usecase.execute();
        
          return res.status(result.code).send(
          result
        );
        
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
    

          return res.status(result.code).send(
            result
          );

        } catch (error: any) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            ok: false,
            message: error.toString(),
          });
        }
      }

      public async updateUser(req: Request, res: Response) {
        try {
          const { userId } = req.params;
          const { email, password } = req.body;
           
          const usecase = new updateUserUsecase();
          const result = await usecase.execute({userId, email, password});
          

          return res.status(result.code).send(
            result
          );

        } catch (error: any) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            ok: false,
            message: error.toString(),
          });
        }
      }

      public async deleteUser(req: Request, res: Response) {
        try {
          const { userId } = req.params;
    
          const usecase = new deleteUserUsecase();
          const result = await usecase.execute({userId});
    
          return res.status(result.code).send(
            result    
          );

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

            return res.status(result.code).send(
              result
            );  
          
        } catch (error: any) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            ok: false,
            message: error.toString(),
          });
        }
    }
    
  }
      

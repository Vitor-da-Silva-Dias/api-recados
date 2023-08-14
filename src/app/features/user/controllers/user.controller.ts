import { Request, Response } from "express";
import { User } from "../../../models/user.model";
import { StatusCodes } from "http-status-codes";
import { UserRepository } from "../repositories/user.repository";

export class UserController {
    public async getAllUsers(req: Request, res: Response) {
      try {
            
          const repository = new UserRepository();
          const result = await repository.list();
        
          return res.status(StatusCodes.OK).send({
          ok: true,
          message: "Users were sucessfully listed", 
          data: result.map((user) => user.toJson())
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
          const repository = new UserRepository();
    
          const emailValid = await repository.getByEmail(email);
    
          if (emailValid) {
            return res.status(StatusCodes.UNAUTHORIZED).send({
              ok: false,
              message: "email already registered",
            });
          }
    
          if (!name) {
            return res.status(StatusCodes.BAD_REQUEST).send({
              ok: false,
              message: "Name was not provided",
            });
          }

          if(!email) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                ok: false,
                message: "E-mail was not provided",
              });
          }

          if (!password) {
            return res.status(StatusCodes.BAD_REQUEST).send({
              ok: false,
              message: "Password was not provided",
            });
          }
          
    
          const user = new User(name, email, password);

          const result = await repository.create(user);

          return res.status(StatusCodes.CREATED).send({
            ok: true,
            message: "User was successfully created",
            data: result.toJson(),
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

            if (!email) {
                return res
                .status(StatusCodes.BAD_REQUEST)
                .send({ ok: false, message: "Email was not provided" });          
                }

            if (!password) {
              return res
              .status(StatusCodes.BAD_REQUEST)
              .send({ ok: false, message: "Password was not provided" });
            }

            const user = await new UserRepository().getByEmail(email);
            
            if (!user || user.password !== password) {
              return res
              .status(StatusCodes.UNAUTHORIZED)
              .send({ ok: false, message: "Invalid email or password" }); 
            }
            
            return res.status(StatusCodes.OK).send({
              ok: true,
              message: "Login successfully done",
              data: user.toJson()
            });
        } catch (error: any) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            ok: false,
            message: error.toString(),
          });
        }
    }
    
  }
      

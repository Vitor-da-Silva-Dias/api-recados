import { StatusCodes } from "http-status-codes";
import { User } from "../../../models/user.model";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../repositories/user.repository";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";



interface CreateCandidateParams {
    name: string;
    email: string;
    password: string;
  }


  export class createUserUsecase implements Usecase {
    public async execute (params: CreateCandidateParams): Promise<Result> {
        const repository = new UserRepository();
        const user = await repository.getByEmail(params.email);

        if (user) {
            return {
              ok: false,
              message: "User already exists",
              code: StatusCodes.BAD_REQUEST,
            };
          }

          const newUser = new User(
            params.name,
            params.email,
            params.password
          );

        const result = await repository.create(newUser);

        const cacheRepository = new CacheRepository();

        await cacheRepository.setEx(`${user!.name}`, 60000, result.toJson());

        await cacheRepository.delete("users");  

        return{
            ok: true,
            message: "User successfully created",
            code: StatusCodes.CREATED,
            data: result.toJson()
        }
         
    }
    
  }
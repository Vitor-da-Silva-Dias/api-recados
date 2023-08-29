import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../repositories/user.repository";

interface UpdateUserParams {
    userId: string,
    email?: string,
    password?: string
  }


  export class updateUserUsecase implements Usecase {
    public async execute (params: UpdateUserParams): Promise<Result> {
        const repository = new UserRepository();
        const user = await repository.get(params.userId);
          
        if (!user) {
            return UsecaseResponse.notFound("User");
        }
    
        if (params.email) {
            user.email = params.email;
        }

        if (params.password) {
            user.password = params.password;
        }
    
        await repository.update(user);

        const cacheRepository = new CacheRepository();
        await cacheRepository.delete("users");

        const data = user.toJson();

        return UsecaseResponse.success(
            "User successfully updated",
            data
        )
    }
  }
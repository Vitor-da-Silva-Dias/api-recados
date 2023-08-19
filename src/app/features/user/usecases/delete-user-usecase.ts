import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";

interface DeleteUserParams {
    userId: string
}


export class deleteUserUsecase implements Usecase {
    public async execute(params: DeleteUserParams): Promise<Result> {
        const userRepository = new UserRepository();
        const deletedUser = await userRepository.delete(params.userId);

        if (deletedUser == 0) {
            return UsecaseResponse.notFound("User");
        }
        
        const cacheRepository = new CacheRepository();

        await cacheRepository.delete("users");

        const result = await userRepository.list();

        const data = result.map((user) => user.toJson());

        return UsecaseResponse.success(
            "User successfully deleted",
            data
        )
    }
}
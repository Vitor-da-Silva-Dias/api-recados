import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErrandRepository } from "../repositories/errand.repository";


export class listErrandUsecase implements Usecase {
    public async execute(userId: string): Promise<Result>{
        const repository = new UserRepository();
        const user = await repository.get(userId);


        if(!user){
            return UsecaseResponse.notFound("User")
        }

        const cacheRepository = new CacheRepository();

        const cacheResult = await cacheRepository.get("errands");

        if (cacheResult) {
            return UsecaseResponse.success (
                "Errands successfully listed in cache", 
                cacheResult
                );
        }

        const result = await new ErrandRepository().list({userId});

        const data = result.map((errand) => errand.toJson());

        await cacheRepository.set("errands", data);

        return UsecaseResponse.success(
            "Errands successfully listed",
            data
        )

    }
}
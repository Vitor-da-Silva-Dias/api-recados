import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErrandRepository } from "../repositories/errand.repository";

interface UpdateErrandParams {
  errandId: string;
  userId: string;
  description: string;
  detail: string;
}

export class updateErrandUsecase implements Usecase {
    public async execute (params: UpdateErrandParams): Promise<Result> {
        const repository = new UserRepository();
        const user = await repository.get(params.userId);

        if(!user){
            return UsecaseResponse.notFound("User")
        }

        const errandRepository = new ErrandRepository();
        const errand = await errandRepository.get({errandId: params.errandId});

        if(!errand){
            return UsecaseResponse.notFound("Errand");
        }

        if (params.description) {
            errand.description = params.description;
        }
      
        if (params.detail) {
            errand.detail = params.detail;
        }
      
        await errandRepository.update(errand);

        const cacheRepository = new CacheRepository();
        await cacheRepository.delete("errands");

        const data = errand.toJson();

        return UsecaseResponse.success(
            "Errand successfully updated",
            data
        )
    }
}
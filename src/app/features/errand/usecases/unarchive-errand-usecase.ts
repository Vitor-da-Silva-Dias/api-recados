import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErrandRepository } from "../repositories/errand.repository";

interface UnarchiveErrandParams {
    userId: string,
    errandId: string
}


export class unarchiveErrandUsecase implements Usecase {
    public async execute(params: UnarchiveErrandParams): Promise<Result> {
        const repository = new UserRepository();
        const user = await repository.get(params.userId);


        if (!user) {
          return UsecaseResponse.notFound("User");
        }
    
        const errandRepository = new ErrandRepository();
        const errand = await errandRepository.get({ errandId: params.errandId });
    
        if (!errand) {
          return UsecaseResponse.notFound("Errand");
        }
    
        if (errand.archived === true) {
          errand.archived = false;
          await errandRepository.update(errand);

        } else {
          return UsecaseResponse.BadRequest("Errand already unarchived");
        }

        const cacheRepository = new CacheRepository();
        await cacheRepository.delete("errands");

        const data = errand.toJson();

        return UsecaseResponse.success(
            "Errand successfully unarchived",
            data
        )
    }
}
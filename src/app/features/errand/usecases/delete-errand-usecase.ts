import { Errand } from "../../../models/errand.model";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErrandRepository } from "../repositories/errand.repository";

interface DeleteErrandParams {
  errandId: string;
  userId: string;
}


export class deleteErrandUsecase implements Usecase {
    public async execute (params: DeleteErrandParams): Promise<Result>{
        const repository = new UserRepository();
        const user = await repository.get(params.userId);

        if(!user){
            return UsecaseResponse.notFound("User")
        }

        const errandRepository = new ErrandRepository();
        const deletedErrand = await errandRepository.delete(params.errandId);

        if(deletedErrand == 0){
            return UsecaseResponse.notFound("Errand");
        }

        const cacheRepository = new CacheRepository();

        await cacheRepository.delete("errands");

        const result = await errandRepository.list({userId: params.userId});

        const data = result.map((errand) => errand.toJson());

        return UsecaseResponse.success(
            "Errand successfully deleted",
            data
        )
    }
}
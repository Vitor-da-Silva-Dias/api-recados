import { StatusCodes } from "http-status-codes";
import { Errand } from "../../../models/errand.model";
import { User } from "../../../models/user.model";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";
import { ErrandRepository } from "../repositories/errand.repository";

interface CreateErrandParams {
  description: string;
  detail: string;
  userId: string;
}


export class createErrandUsecase implements Usecase {
    public async execute (params: CreateErrandParams): Promise<Result> {
        const repository = new ErrandRepository();
        const user = await new UserRepository().get(params.userId)

        if(!user){
            return UsecaseResponse.notFound("User")
        }

        const newErrand = new Errand(
            params.description, 
            params.detail, 
            user
        );

        await repository.create(newErrand);

        const cacheRepository = new CacheRepository();

        await cacheRepository.setEx(`errand - ${user.name}`, 60000, newErrand.toJson());

        await cacheRepository.delete("errands");

        return{
            ok: true,
            message: "Errand successfully created",
            code: StatusCodes.CREATED,
            data: newErrand.toJson()
        }
    }
}
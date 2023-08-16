import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";

export class ListCandidateUsecase implements Usecase {
  public async execute(): Promise<Result> {
    const repository = new UserRepository();
    const cacheRepository = new CacheRepository();

    const cacheResult = await cacheRepository.get("users");

    if (cacheResult) {
      return UsecaseResponse.success (
        "Candidates successfully listed in cache", 
        cacheResult
        );
    }

    const result = await repository.list();

    const data = result?.map((candidate) => candidate.toJson());

    await cacheRepository.set("candidates", data);

    return UsecaseResponse.success (
      "Candidates successfully listed",
      data
    );
  }
}

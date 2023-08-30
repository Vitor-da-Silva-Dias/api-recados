import { unarchiveErrandUsecase } from "../../../../../src/app/features/errand/usecases/unarchive-errand-usecase";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { ErrandRepository } from "../../../../../src/app/features/errand/repositories/errand.repository";
import { User } from "../../../../../src/app/models/user.model";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { CacheDatabase } from "../../../../../src/main/database/cache.connection";
import { Database } from "../../../../../src/main/database/database.connection";
import { Errand } from "../../../../../src/app/models/errand.model";


describe("Unarchive Errand Usecase", () => {
    beforeAll(async () => {
      await Database.connect();
      await CacheDatabase.connect();
    });
  
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    const userMockSut = new User(
        "any_name",
        "any_email",
        "any_password",
    );

    const errandMockSut = new Errand(
        "any_description",
        "any_detail",
        userMockSut,
        true
    );

    const createSut = () => {
        return new unarchiveErrandUsecase();
    };
  
    afterAll(async () => {
      await Database.connection.destroy();
      await CacheDatabase.connection.quit();
    });

    test("deveria retornar falha caso o usuário não seja encontrado", async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(undefined);

        const result = await sut.execute({
            userId: "wrong_userId",
            errandId: "any_errandId"
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.code).toBe(404);
        expect(result.message).toEqual("User not found");
    });

    test("deveria retornar falha caso o recado não seja encontrado", async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(userMockSut);
        jest.spyOn(ErrandRepository.prototype, "get").mockResolvedValue(undefined);

        const result = await sut.execute({
            errandId: "wrong_errandId",
            userId: "any_userId"
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.code).toBe(404);
        expect(result.message).toEqual("Errand not found");
    });

    test("deveria retornar sucesso caso o recado seja desarquivado", async () =>{
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(userMockSut);
        jest.spyOn(ErrandRepository.prototype, "get").mockResolvedValue(errandMockSut);

        const result = await sut.execute({
            errandId: "any_errandId",
            userId: "any_userId",
            archived: false
        });

        jest.spyOn(ErrandRepository.prototype, "update").mockResolvedValue();
        jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result.message).toEqual("Errand successfully unarchived");
        expect(result).toHaveProperty("data");
    })

    test("deveria retornar falha caso o recado já esteja desarquivado", async () =>{
        const sut = createSut();
        const archived = errandMockSut.archived = false;

        jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(userMockSut);
        jest.spyOn(ErrandRepository.prototype, "get").mockResolvedValue(errandMockSut);

        const result = await sut.execute({
            errandId: "any_errandId",
            userId: "any_userId",
            archived
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.code).toBe(400);
        expect(result.message).toEqual("Bad request: Errand already unarchived");
    })
});

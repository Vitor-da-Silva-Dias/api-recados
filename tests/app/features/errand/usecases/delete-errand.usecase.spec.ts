import { deleteErrandUsecase } from "../../../../../src/app/features/errand/usecases/delete-errand-usecase";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { CacheDatabase } from "../../../../../src/main/database/cache.connection";
import { Database } from "../../../../../src/main/database/database.connection";
import { User } from "../../../../../src/app/models/user.model";
import { ErrandRepository } from "../../../../../src/app/features/errand/repositories/errand.repository";
import { Errand } from "../../../../../src/app/models/errand.model";


describe("Delete Errand Usecase", () => {
    beforeAll(async () => {
      await Database.connect();
      await CacheDatabase.connect();
    });
  
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
  
    afterAll(async () => {
      await Database.connection.destroy();
      await CacheDatabase.connection.quit();
    });

    const userMockSut = new User(
        "any_name",
        "any_email",
        "any_password",
    );

    const errandMockSut = new Errand(
        "any_description",
        "any_detail",
        userMockSut
    );

    const createSut = () => {
        return new deleteErrandUsecase();
    };

    test("deveria retornar falha caso o usuário não seja encontrado", async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(undefined);

        const result = await sut.execute({
            errandId: "any_id",
            userId: "wrong_id"
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.code).toBe(404);
        expect(result.message).toEqual("User not found");
    });

    test("deveria retornar falha caso o recado não seja encontrado", async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(userMockSut);
        jest.spyOn(ErrandRepository.prototype, "delete").mockResolvedValue(0);

        const result = await sut.execute({
            errandId: "wrong_id",
            userId: "any_id"
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.code).toBe(404);
        expect(result.message).toEqual("Errand not found");
    });

    test("deveria retornar sucesso caso o recado seja deletado", async () => {
        const errands: Errand[] = [errandMockSut];
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(userMockSut);
        jest.spyOn(ErrandRepository.prototype, "delete").mockResolvedValue(1);

        const result = await sut.execute({
            userId: "any_id",
            errandId: "any_errandId"
        });

        jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();
        jest.spyOn(ErrandRepository.prototype, "list").mockResolvedValue(errands);

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result.message).toEqual("Errand successfully deleted");
        expect(result).toHaveProperty("data");
    })
});
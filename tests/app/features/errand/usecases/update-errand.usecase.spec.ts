import { updateErrandUsecase } from "../../../../../src/app/features/errand/usecases/update-errand-usecase";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { ErrandRepository } from "../../../../../src/app/features/errand/repositories/errand.repository";
import { User } from "../../../../../src/app/models/user.model";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { CacheDatabase } from "../../../../../src/main/database/cache.connection";
import { Database } from "../../../../../src/main/database/database.connection";
import { Errand } from "../../../../../src/app/models/errand.model";


describe("Update Errand Usecase", () => {
    beforeAll(async () => {
      await Database.connect();
      await CacheDatabase.connect();
    });
  
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();

      jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(userMockSut);
      jest.spyOn(ErrandRepository.prototype, "get").mockResolvedValue(errandMockSut);
      jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();
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
        return new updateErrandUsecase();
    };
  
    afterAll(async () => {
      await Database.connection.destroy();
      await CacheDatabase.connection.quit();
    });

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

    test("deveria retornar sucesso caso seja informada a nova descrição do recado", async () => {
        const sut = createSut();

        const result = await sut.execute({
            userId: "any_userId",
            errandId: "any_errandId",
            description: "description_edit"
        });

        jest.spyOn(ErrandRepository.prototype, "update").mockResolvedValue();

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result.message).toEqual("Errand successfully updated");
        expect(result).toHaveProperty("data");
    });

    test("deveria retornar sucesso caso seja informado o novo detalhamento do recado", async () => {
        const sut = createSut();

        const result = await sut.execute({
            userId: "any_userId",
            errandId: "any_errandId",
            detail: "detail_edit"
        });

        jest.spyOn(ErrandRepository.prototype, "update").mockResolvedValue();

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result.message).toEqual("Errand successfully updated");
        expect(result).toHaveProperty("data");
    });

    test("deveria retornar sucesso caso sejam informados a nova descrição e o novo detalhamento do recado", async () => {
        const sut = createSut();

        const result = await sut.execute({
            userId: "any_userId",
            errandId: "any_errandId",
            description: "description_edit",
            detail: "detail_edit"
        });

        jest.spyOn(ErrandRepository.prototype, "update").mockResolvedValue();

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result.message).toEqual("Errand successfully updated");
        expect(result).toHaveProperty("data");
    });
});
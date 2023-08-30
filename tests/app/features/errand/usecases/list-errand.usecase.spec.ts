import { listErrandUsecase } from "../../../../../src/app/features/errand/usecases/list-errand-usecase";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { ErrandRepository } from "../../../../../src/app/features/errand/repositories/errand.repository";
import { User } from "../../../../../src/app/models/user.model";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { CacheDatabase } from "../../../../../src/main/database/cache.connection";
import { Database } from "../../../../../src/main/database/database.connection";
import { Errand } from "../../../../../src/app/models/errand.model";


describe("List Errand Usecase", () => {
    beforeAll(async () => {
      await Database.connect();
      await CacheDatabase.connect();
  
      jest.setTimeout(300000);
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
        return new listErrandUsecase();
    };

    test("deveria retornar falha caso o usuário não seja encontrado", async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(undefined);

        const result = await sut.execute("wrong_userId");

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.code).toBe(404);
        expect(result.message).toEqual("User not found");
    });

    test("deveria retornar sucesso e indicação de cache se houve cache para a lista de recados", async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(userMockSut);
        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(true);

        const result = await sut.execute("any_userId");

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result).toHaveProperty("message", "Errands successfully listed in cache");
        expect(result).toHaveProperty("data");
    });

    test("deveria retornar sucesso sem indicação de cache se não houver cache", async () => {
        const sut = createSut();
        const errands: Errand[] = [errandMockSut];

        jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(userMockSut);
        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);
        jest.spyOn(ErrandRepository.prototype, "list").mockResolvedValue(errands);
        jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();

        const result = await sut.execute("any_userId");

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result).toHaveProperty("message", "Errands successfully listed");
        expect(result).toHaveProperty("data");
        expect(result.data.length).toBeGreaterThan(0);
    });

    test("deveria retornar sucesso e uma lista vazia se não houver nenhum recado cadastrado", async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(userMockSut);
        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);
        jest.spyOn(ErrandRepository.prototype, "list").mockResolvedValue([]);
        jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();

        const result = await sut.execute("any_userId");

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result).toHaveProperty("message", "Errands successfully listed");
        expect(result).toHaveProperty("data");
        expect(result.data).toHaveLength(0);
    });
});
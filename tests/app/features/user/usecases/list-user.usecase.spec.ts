import {ListUserUsecase} from "../../../../../src/app/features/user/usecases/list-user.usecase";
import {UserRepository} from "../../../../../src/app/features/user/repositories/user.repository";
import { User } from "../../../../../src/app/models/user.model";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { CacheDatabase } from "../../../../../src/main/database/cache.connection";
import { Database } from "../../../../../src/main/database/database.connection";


describe("List User Usecase", () => {
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

    const createSut = () => {
        return new ListUserUsecase();
    };

    test("deveria retornar sucesso e indicação de cache se houve cache para a lista de usuários", async () => {
        const sut = createSut();

        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(true);

        const result = await sut.execute();

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result).toHaveProperty("message", "Users successfully listed in cache");
        expect(result).toHaveProperty("data");
    });

    test("deveria retornar sucesso sem indicação de cache se não houver cache", async () => {
        const sut = createSut();
        const users: User[] = [userMockSut];

        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);
        jest.spyOn(UserRepository.prototype, "list").mockResolvedValue(users);
        jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();

        const result = await sut.execute();

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result).toHaveProperty("message", "Users successfully listed");
        expect(result).toHaveProperty("data");
        expect(result.data.length).toBeGreaterThan(0);
    });

    test("deveria retornar sucesso e uma lista vazia se não houver nenhum usuário cadastrado", async () => {
        const sut = createSut();

        jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);
        jest.spyOn(UserRepository.prototype, "list").mockResolvedValue([]);
        jest.spyOn(CacheRepository.prototype, "set").mockResolvedValue();

        const result = await sut.execute();

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result).toHaveProperty("message", "Users successfully listed");
        expect(result).toHaveProperty("data");
        expect(result.data).toHaveLength(0);
    });
});  

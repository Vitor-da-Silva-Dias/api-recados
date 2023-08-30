import {updateUserUsecase} from "../../../../../src/app/features/user/usecases/update-user.usecase";
import {UserRepository} from "../../../../../src/app/features/user/repositories/user.repository";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { CacheDatabase } from "../../../../../src/main/database/cache.connection";
import { Database } from "../../../../../src/main/database/database.connection";
import { User } from "../../../../../src/app/models/user.model";


describe("Update User Usecase", () => {
    beforeAll(async () => {
      await Database.connect();
      await CacheDatabase.connect();
    });
  
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();

      jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(userMockSut);
      jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();
    });

    const userMockSut = new User(
        "any_name",
        "any_email",
        "any_password",
      );

    const createSut = () => {
        return new updateUserUsecase();
    };
  
    afterAll(async () => {
      await Database.connection.destroy();
      await CacheDatabase.connection.quit();
    });

    test("deveria retornar falha caso o usuário não seja encontrado", async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, "get").mockResolvedValue(undefined);

        const result = await sut.execute({
            userId: "wrong_id",
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.code).toBe(404);
        expect(result.message).toEqual("User not found");
    });

    test("deveria retornar sucesso caso seja informado o novo email do usuário", async () => {
        const sut = createSut();

        const result = await sut.execute({
            userId: "any_id",
            email: "email_edit",
        });

        jest.spyOn(UserRepository.prototype, "update").mockResolvedValue();

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result.message).toEqual("User successfully updated");
        expect(result).toHaveProperty("data");
    });

    test("deveria retornar sucesso caso seja informado o novo password do usuário", async () => {
        const sut = createSut();

        const result = await sut.execute({
            userId: "any_id",
            password: "password_edit",
        });

        jest.spyOn(UserRepository.prototype, "update").mockResolvedValue();

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result.message).toEqual("User successfully updated");
        expect(result).toHaveProperty("data");
    });

    test("deveria retornar sucesso caso sejam informados novo email e password do usuário", async () => {
        const sut = createSut();

        const result = await sut.execute({
            userId: "any_id",
            email: "email_edit",
            password: "password_edit"
        });

        jest.spyOn(UserRepository.prototype, "update").mockResolvedValue();

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result.message).toEqual("User successfully updated");
        expect(result).toHaveProperty("data");
    });
});
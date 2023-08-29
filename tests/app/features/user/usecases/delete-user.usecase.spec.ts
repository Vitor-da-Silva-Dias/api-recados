import {deleteUserUsecase} from "../../../../../src/app/features/user/usecases/delete-user.usecase";
import {UserRepository} from "../../../../../src/app/features/user/repositories/user.repository";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { CacheDatabase } from "../../../../../src/main/database/cache.connection";
import { Database } from "../../../../../src/main/database/database.connection";
import { User } from "../../../../../src/app/models/user.model";


describe("Delete User Usecase", () => {
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

    const createSut = () => {
        return new deleteUserUsecase();
    };

    test("deveria retornar falha caso o usuário não seja encontrado", async () => {
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, "delete").mockResolvedValue(0);

        const result = await sut.execute({
            userId: "wrong_id"
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(result.code).toBe(404);
        expect(result.message).toEqual("User not found");
    })

    test("deveria retornar sucesso caso o usuário seja deletado", async () => {
        const users: User[] = [userMockSut];
        const sut = createSut();

        jest.spyOn(UserRepository.prototype, "delete").mockResolvedValue(1);

        const result = await sut.execute({
            userId: "any_id"
        });

        jest.spyOn(CacheRepository.prototype, "delete").mockResolvedValue();
        jest.spyOn(UserRepository.prototype, "list").mockResolvedValue(users);

        expect(result).toBeDefined();
        expect(result.ok).toBe(true);
        expect(result.code).toBe(200);
        expect(result.message).toEqual("User successfully deleted");
    })
});

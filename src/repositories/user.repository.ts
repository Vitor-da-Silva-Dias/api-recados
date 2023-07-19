import { Database } from "../database/config/database.connection";
import { UserEntity } from "../database/entities/user.entity";
import { User } from "../models/user.model";


export class UserRepository {
    private repository = Database.connection.getRepository(UserEntity);

    public async list() {
        const result = await this.repository.find();

        console.log(result);

        return result.map((entity) => UserRepository.mapRowToModel(entity));
    }

    public async create(user: User) {
        const UserEntity = this.repository.create({
            userid: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            errands: user.errands,
        });

        await this.repository.save(UserEntity);
    }

    public async delete(userid: string) {
        const result = await this.repository.delete({
            userid,
        });

        return result.affected ?? 0;
    }

    public async update(user: User) {
        await this.repository.update(
            {
                userid: user.id,
            },
            {
                email: user.email,
                password: user.password
            }
        );
    }

    public static mapRowToModel(row: UserEntity): User {
        return User.create(row);
    }
}
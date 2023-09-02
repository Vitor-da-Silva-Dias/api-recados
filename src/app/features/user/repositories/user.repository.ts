import { Database } from "../../../../main/database/database.connection";
import { UserEntity } from "../../../shared/database/entities/user.entity";
import { User } from "../../../models/user.model";


export class UserRepository {
    private repository = Database.connection.getRepository(UserEntity);

    public async list() {
        const result = await this.repository.find();

        console.log(result);

        return result.map((entity) => UserRepository.mapRowToModel(entity));
    }

    public async get(userId: string) {
        
        const result = await this.repository.findOneBy({
            userId,
        });

        if (!result) {
            return undefined;
        }

        return UserRepository.mapRowToModel(result);
    }

    public async getByEmail(email: string) {
        const results = await this.repository.findOne({ where: { email } });
    
        if (!results) {
          return undefined;
        }
    
        return UserRepository.mapRowToModel(results);
      }
    

    public async create(user: User) {
        const UserEntity = this.repository.create({
            userId: user.userId,
            name: user.name,
            email: user.email,
            password: user.password,
            errands: user.errands
        });

        const result = await this.repository.save(UserEntity);

        return UserRepository.mapRowToModel(result);
    }

    public async delete(userId: string) {
        const result = await this.repository.delete({
            userId,
        });

        return result.affected ?? 0;
    }

    public async update(user: User) {
        await this.repository.update(
            {
                userId: user.userId,
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
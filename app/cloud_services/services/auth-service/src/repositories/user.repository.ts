
import { UserDocument, UserModel } from "shared-mongoose-schemas";
import { IUserRepository } from "./user.repository.interface";

export class UserRepository implements IUserRepository {
  async findByUsername(username: string): Promise<UserDocument | null> {
    return UserModel.findOne({ username }).exec();
  }

  async create(data: { username: string; email?: string; passwordHash: string; roles?: string[] }) {
    return UserModel.create(data);
  }
}

export const userRepository = new UserRepository();

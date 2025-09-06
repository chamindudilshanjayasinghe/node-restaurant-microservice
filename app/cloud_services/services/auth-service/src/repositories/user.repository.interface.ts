import { UserDocument } from "shared-mongoose-schemas";


export interface IUserRepository {
  findByUsername(username: string): Promise<UserDocument | null>;
  create(data: { username: string; email?: string; passwordHash: string; roles?: string[] }): Promise<UserDocument>;
}

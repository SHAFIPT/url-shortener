import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { UserModel } from "../models/UserModel";

export class UserRepository implements IUserRepository {
  async create(data: Partial<User>): Promise<User> {
    const doc = await UserModel.create(data);
    return this.map(doc);
  }
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    return doc ? this.map(doc) : null;
  }
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? this.map(doc) : null;
  }
  async save(user: User): Promise<User> {
    const doc = await UserModel.findByIdAndUpdate(user.id, user, { new: true });
    return this.map(doc!);
  }
  async setRefreshToken(userId: string, token: string | null): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { refreshToken: token });
  }
  private map(doc: any): User {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      isVerified: doc.isVerified,
      refreshToken: doc.refreshToken,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

import { User } from "../entities/User";

export interface IUserRepository{
    create(data: Partial<User>): Promise<User>
    findByEmail(email: string): Promise<User | null>
    findById(id: string): Promise<User | null>
    save(user: User): Promise<User>
    setRefreshToken(userId: string, token: string | null): Promise<void>
}
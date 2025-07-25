import { Messages } from "../../../constants/messages";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";

export class LogoutUseCase {
  constructor(private readonly userRepo: IUserRepository) {}
  async execute(userId: string) {
    await this.userRepo.setRefreshToken(userId, null);
    return { message: Messages.LOGOUT_SUCCESS };
  }
}
import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../../domain/interfaces/IPasswordHasher';

export class BcryptPasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
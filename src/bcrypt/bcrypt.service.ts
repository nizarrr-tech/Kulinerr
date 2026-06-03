import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptService {
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const bcrypt = await import('bcrypt');
        return bcrypt.hash(password, saltRounds);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        const bcrypt = await import('bcrypt');
        return bcrypt.compare(password, hash);
    }
}

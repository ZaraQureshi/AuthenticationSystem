import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../repository/IUserRepository";

@injectable()
export class AccountLockService {
    constructor(
        @inject("IUserRepository") private userRepo: IUserRepository,
        @inject("AccountLockConfig") private config: {
            maxAttempts: number,
            lockDurationMin: number
        }
    ) { }

    async isLocked(email: any) {

        const user = await this.userRepo.GetUserByEmail(email);
        if (user[0].isBlocked) {
            console.log("User lock info:", user[0].isBlocked, user[0].lockedUntil);
            return user[0].isBlocked && user[0].lockedUntil > new Date();
        }
        return null;
    }

    async recordFailure(email: string) {
        const attempts = await this.userRepo.incrementFailedAttempts(email);
        console.log("Failed attempts for", email, attempts.failedLoginAttempts,this.config.maxAttempts);
        if (attempts.failedLoginAttempts >= this.config.maxAttempts) {
            const lockedUntil = new Date(
                Date.now() + this.config.lockDurationMin * 60 * 1000
            );
            console.log("Locking account for", email, "until", lockedUntil);
            await this.userRepo.lockAccount(email, lockedUntil);
        }
    }

    async recordSuccess(email: string) {
        await this.userRepo.resetFailedAttempts(email);
    }
}

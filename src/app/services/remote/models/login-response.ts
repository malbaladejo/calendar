import { User } from './user';

export interface LoginResponse {
    tokenDurationInMinutes: number;
    refreshTokenDurationInDays: number;
    user: User;
}

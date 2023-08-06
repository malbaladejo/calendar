import { InjectionToken } from '@angular/core';
import { LoginResponse } from './models/login-response';
import { RegisterRequest } from './models/register-request';
import { User } from './models/user';
import { Observable } from 'rxjs';

export const AUTH_SERVICE_TOKEN = new InjectionToken<AuthService>('AuthService');

export interface AuthService {
    loginRequestAsync(name: string | null | undefined): Promise<void>;

    // loginAsync(token: string | null | undefined): Promise<void>;

    logoutAsync(): Promise<void>;

    registerAsync(request: RegisterRequest): Promise<LoginResponse>;

    refreshAsync(): Promise<LoginResponse>;

    getUserAsync(): Promise<User | null | undefined>;

    currentUser$: Observable<User | null | undefined>;
}
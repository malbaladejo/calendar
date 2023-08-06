import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { User } from '../models/user';
import { RegisterRequest } from '../models/register-request';

@Injectable({ providedIn: 'root' })
export class AuthImplService implements AuthService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api/Authenticate';


    private readonly _currentUser: BehaviorSubject<User | null | undefined>;
    private readonly _currentUser$: Observable<User | null | undefined>;

    constructor() {
        this._currentUser = new BehaviorSubject<User | null | undefined>(null);
        this._currentUser$ = this._currentUser.asObservable();
    }

    public get currentUser$(): Observable<User | null | undefined> {
        return this._currentUser$;
    }

    /*
        const params = new HttpParams()
        .set('nameOrEmail', this.form.value.identifier?.trim() ?? '');
    
      this.http.get(this.apiUrl, { params }).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.emailSent.set(true);
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
        }
    */
    public async loginRequestAsync(name: string | null | undefined): Promise<void> {
        await firstValueFrom(
            this.http.post<LoginResponse>(
                `${this.baseUrl}/login-request?name=${name ?? ''}`, {}
            )) as LoginResponse;
    }

    // public async loginAsync(token: string | null | undefined): Promise<void> {
    //     await firstValueFrom(
    //         this.http.post<LoginResponse>(
    //             `${this.baseUrl}/login?token=${token ?? ''}`, {}
    //         )) as LoginResponse;
    // }


    // public async loginAsync(token: string | null | undefined): Promise<void> {
    //     await firstValueFrom(
    //         this.http.post<LoginResponse>(
    //             `${this.baseUrl}/login?token=${token ?? ''}`, {}
    //         )) as LoginResponse;
    // }

    public async logoutAsync(): Promise<void> {
        await firstValueFrom(this.http.post(`${this.baseUrl}/logout`, { withCredentials: true }));

        this._currentUser.next(null);
    }

    public registerAsync(request: RegisterRequest): Promise<LoginResponse> {
        return firstValueFrom(this.http.post<LoginResponse>(
            `${this.baseUrl}/register`, request,
            { withCredentials: true }));
    }

    public refreshAsync(): Promise<LoginResponse> {
        return firstValueFrom(this.http.post<LoginResponse>(`${this.baseUrl}/refresh`, null, {
            withCredentials: true
        }));
    }

    public getUserAsync(): Promise<User | null | undefined> {
        return firstValueFrom(this.http.get<User>(`${this.baseUrl}/user`, {
            withCredentials: true
        }));
    }
}

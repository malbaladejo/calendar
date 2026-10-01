import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AUTH_SERVICE_TOKEN, AuthService } from '../../services/remote/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

enum LoginState {
    request,
    requestInError,
    requestSending,
    waitForOtp,
    loginSending,
    loginInError
}

@Component({
    selector: 'app-login-request',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login-request.component.html',
    styleUrls: ['./login-request.component.scss']
})
export class LoginRequestComponent implements OnInit {
    public state = signal(LoginState.request);
    public loginState = LoginState;
    public errorMessage = signal<string | null>(null);
    public nameForm: ReturnType<FormBuilder['group']>;
    public otpForm: ReturnType<FormBuilder['group']>;

    private _name: string | null = null;
    private _password: string | null = null;

    public constructor(
        @Inject(AUTH_SERVICE_TOKEN) private readonly _authService: AuthService,
        private readonly fb: FormBuilder,
        private readonly _route: ActivatedRoute,
        private readonly _router: Router) {

        this.nameForm = this.fb.group({
            identifier: ['', [Validators.required, Validators.minLength(2)]]
        });

        this.otpForm = this.fb.group({
            otp: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    public ngOnInit(): void {
        this._name = this._route.snapshot.queryParamMap.get('name');
        this._password = this._route.snapshot.queryParamMap.get('password');

        if (this._name && this._password) {
            this.loginAsync();
        }
    }

    public get identifier() {
        return this.nameForm.get('identifier');
    }

    public get password() {
        return this.otpForm.get('otp');
    }

    public async onSubmit(): Promise<void> {
        switch (this.state()) {
            case LoginState.request:
            case LoginState.requestInError:
                await this.requestOtpAsync();
                break;
            case LoginState.waitForOtp:
            case LoginState.loginInError:
                await this.loginAsync();
                break;
        }
    }

    private async requestOtpAsync(): Promise<void> {
        if (this.nameForm.invalid) {
            this.nameForm.markAllAsTouched();
            return;
        }

        this.errorMessage.set(null);

        try {
            this._name = this.nameForm.value.identifier?.trim();

            this.state.set(LoginState.requestSending);
            await this._authService.loginRequestAsync(this._name);
            this.state.set(LoginState.waitForOtp);
        } catch {
            this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
            this.state.set(LoginState.requestInError);
        }
    }

    private async loginAsync(): Promise<void> {
        if (this.otpForm.invalid) {
            this.otpForm.markAllAsTouched();
            return;
        }

        this.errorMessage.set(null);

        try {
            this.state.set(LoginState.loginSending);
            this._password = this.otpForm.value.otp?.trim();
            await this._authService.loginAsync(this._name, this._password);
            this._router.navigate(['/']);
        } catch {
            this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
            this.state.set(LoginState.loginInError);
        }
    }
}
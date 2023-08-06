import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AUTH_SERVICE_TOKEN, AuthService } from '../services/remote/auth.service';

@Component({
    selector: 'app-login-request',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login-request.component.html',
    styleUrls: ['./login-request.component.scss']
})
export class LoginRequestComponent {
    public isSubmitting = signal(false);
    public emailSent = signal(false);
    public errorMessage = signal<string | null>(null);

    public form = this.fb.group({
        identifier: ['', [Validators.required, Validators.minLength(2)]]
    });

    constructor(
        @Inject(AUTH_SERVICE_TOKEN) private readonly _authService: AuthService,
        private fb: FormBuilder
    ) { }

    public get identifier() {
        return this.form.get('identifier');
    }

    public async onSubmit(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.errorMessage.set(null);
        this.isSubmitting.set(true);

        try {
            await this._authService.loginRequestAsync(this.form.value.identifier?.trim());
            this.isSubmitting.set(false);
            this.emailSent.set(true);
        } catch {
            this.errorMessage.set('Une erreur est survenue. Veuillez réessayer.');
            this.isSubmitting.set(false);
        }
    }

    public resetForm(): void {
        this.emailSent.set(false);
        this.form.reset();
    }
}
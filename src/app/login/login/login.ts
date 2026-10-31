import { ChangeDetectionStrategy, Component, Inject, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AUTH_SERVICE_TOKEN, AuthService } from '../../services/remote/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly showPassword = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    nom: ['', [Validators.required]],
    motDePasse: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor(@Inject(AUTH_SERVICE_TOKEN) private readonly _authService: AuthService,
    private readonly _router: Router) {

  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nom, motDePasse } = this.form.getRawValue();

    try {
      await this._authService.loginAsync(nom, motDePasse);
      this._router.navigate(['/agenda']);
    } catch (error) {
      console.error('Login failed:', error);
      // Handle the error, e.g., show an error message to the user
      // TODO afficher un message d'erreur à l'utilisateur
    }

  }
}
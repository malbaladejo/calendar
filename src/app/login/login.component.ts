// // login/login.component.ts
// import { Component, Inject } from '@angular/core';
// import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { AUTH_SERVICE_TOKEN, AuthService } from '../services/remote/auth.service';

// /**
//  * Remplacer par Login-request
//  */
// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [
//     ReactiveFormsModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     MatIconModule,
//     MatProgressSpinnerModule
//   ],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss'
// })
// export class LoginComponent {

//   public form = new FormGroup({
//     userName: new FormControl('', [Validators.required])
//   });

//   public loading = false;
//   public errorMessage = '';
//   public hidePassword = true;

//   constructor(
//     @Inject(AUTH_SERVICE_TOKEN) private readonly _authService: AuthService,
//     private readonly _router: Router) { }

//   async onSubmit(): Promise<void> {
//     if (this.form.invalid) return;

//     this.loading = true;
//     this.errorMessage = '';

//     try {
//       await this._authService.loginRequestAsync(this.form.value.userName);
//       this._router.navigate(['/']);
//     } catch {
//       this.errorMessage = "Une erreur est survenue. Veuillez réessayer.";
//     } finally {
//       this.loading = false;
//     }
//   }
// }
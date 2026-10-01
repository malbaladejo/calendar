import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-login-otp',
  styleUrl: './login-otp.scss',
  templateUrl: './login-otp.html',
})
export class LoginOTP implements OnInit {
  public form: ReturnType<FormBuilder['group']>;

  public get password() {
    return this.form.get('password');
  }

  private _name: string | null = null;

  public constructor(
    private readonly fb: FormBuilder,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router) {

    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public ngOnInit(): void {
    this._name = this._route.snapshot.queryParamMap.get('name');
  }

  public async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const password = this.form.value.password?.trim();

    this._router.navigate(['/login'], { queryParams: { name: this._name, password: password } });
  }
}

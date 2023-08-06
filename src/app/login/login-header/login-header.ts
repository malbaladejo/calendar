import { Component, Inject, OnInit, OnDestroy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AUTH_SERVICE_TOKEN, AuthService } from 'src/app/services/remote/auth.service';
import { User } from 'src/app/services/remote/models/user';

@Component({
  selector: 'app-login-header',
  imports: [
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './login-header.html',
  styleUrl: './login-header.scss',
  standalone: true
})
export class LoginHeaderComponent implements OnInit, OnDestroy {
  public readonly isLogged = signal(false);
  private _loginSubsciption?: Subscription;
  private _user?: User | null;

  constructor(
    @Inject(AUTH_SERVICE_TOKEN) private readonly _authService: AuthService,
    private readonly _router: Router) {

  }

  public async ngOnInit(): Promise<void> {
    this._loginSubsciption = this._authService.currentUser$.subscribe(l => this.loginChange(l));
    this.isLogged.set(false);
    try {
      this._user = await this._authService.getUserAsync();
      this.isLogged.set(true);
    }
    catch {

    }
  }

  public ngOnDestroy(): void {
    this._loginSubsciption?.unsubscribe();
  }

  public get userName(): string | undefined {
    return this._user?.name;
  }

  public async logoutAsync(): Promise<void> {

    try {
      await this._authService.logoutAsync();
      this._user = null;
      this.isLogged.set(false);
      this._router.navigate(['/login']);
    }
    catch (e) {
      console.error(e);
    }
  }

  private loginChange(user: User | null | undefined): void {
    if (user) {
      this.isLogged.set(true);
    }

    this._user = user;
  }
}

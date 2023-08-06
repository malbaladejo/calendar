import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AUTH_SERVICE_TOKEN, AuthService } from '../services/remote/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-connexion',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './connexion.component.html',
    styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {
    public loading = signal<boolean>(false);
    public errorMessage = signal<string | null>(null);

    constructor(
        @Inject(AUTH_SERVICE_TOKEN) private readonly _authService: AuthService,
        private readonly route: ActivatedRoute,
        private readonly _router: Router) { }

    public async ngOnInit(): Promise<void> {
        const token = this.route.snapshot.paramMap.get('token');
        try {
            await this._authService.loginRequestAsync(token);
            this._router.navigate(['/']);
        } catch {
            this.errorMessage.set("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            this.loading.set(false);
        }
    }
}
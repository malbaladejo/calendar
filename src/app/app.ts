import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LoginHeaderComponent } from './login/login-header/login-header';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrls: ['./app.scss'],
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        MatButtonModule,
        MatToolbarModule,
        LoginHeaderComponent
    ]
})
export class App {

}
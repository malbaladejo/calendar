import {  Routes } from '@angular/router';
import { WeeksComponent } from './weeks/weeks.component';
import { DataBaseComponent } from './data-base/data-base.component';
import { PostItBoardComponent } from './post-it-board/post-it-board.component';
import { YearComponent } from './years/year/year.component';
import { LoginRequestComponent } from './login-request/login-request.component';
import { ConnexionComponent } from './connexion/connexion.component';

export const routes: Routes = [
  { path: 'login', component: LoginRequestComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'agenda', component: YearComponent },
  { path: 'semaines', component: WeeksComponent },
  { path: 'database', component: DataBaseComponent },
  { path: 'post-it', component: PostItBoardComponent },
  { path: '', redirectTo: '/agenda', pathMatch: 'full' }, // redirect to 
];
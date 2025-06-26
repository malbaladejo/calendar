import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YearComponent } from './years/year/year.component';
import { WeeksComponent } from './weeks/weeks.component';

const routes: Routes = [
  { path: 'agenda', component: YearComponent },
  { path: 'semaines', component: WeeksComponent },
  { path: '', redirectTo: '/agenda', pathMatch: 'full' }, // redirect to 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

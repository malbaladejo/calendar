import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YearComponent } from './years/year/year.component';
import { WeeksComponent } from './weeks/weeks.component';
import { DataBaseComponent } from './data-base/data-base.component';

const routes: Routes = [
  { path: 'agenda', component: YearComponent },
  { path: 'semaines', component: WeeksComponent },
  { path: 'database', component: DataBaseComponent },
  { path: '', redirectTo: '/agenda', pathMatch: 'full' }, // redirect to 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

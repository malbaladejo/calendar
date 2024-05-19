import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YearComponent } from './years/year/year.component';
import { ScheduleComponent } from './schedule/schedule/schedule.component';
import { WeekComponent } from './schedule/week/week.component';
import { YearNavigationComponent } from './years/year-navigation/year-navigation.component';

const routes: Routes = [
  { path: 'agenda', component: YearComponent },
  {
    path: 'emploi-du-temps',
    component: ScheduleComponent,
    children: [
      { path: ':id', component: WeekComponent }
    ]
  },
  { path: '', redirectTo: 'agenda', pathMatch: 'full' }, // redirect to 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

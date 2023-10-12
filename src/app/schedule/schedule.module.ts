import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { WeekComponent } from './week/week.component';
import { MaterialModule } from '../material.module';
import { WeeklyDayComponent } from './weekly-day/weekly-day.component';
import { DatePipe } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';
import { RouterModule } from '@angular/router';
import { ScheduleService } from './services/schedule.service';
import { ScheduleDataService } from './services/schedule-data.service';
import { ScheduleDataLocalStorageService } from './services/schedule-data-local-storage.service';

@NgModule({
  declarations: [
    WeekComponent,
    WeeklyDayComponent,
    ScheduleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    RouterModule,
    DatePipe
  ],
  providers: [
    ScheduleService,
    { provide: ScheduleDataService, useClass: ScheduleDataLocalStorageService }
  ],
  exports: [
    WeekComponent
  ]
})
export class ScheduleModule { }

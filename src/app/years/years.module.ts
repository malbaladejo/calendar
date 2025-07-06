import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { EasterProvider } from './services/easter-provider';
import { SpecialDaysService } from './services/specialdays.service';
import { DayComponent } from './day/day.component';
import { MonthComponent } from './month/month.component';
import { YearComponent } from './year/year.component';
import { JeuneGenevoisProvider } from './services/jeune-genevois-provider';
import { SchoolHolidaysService } from './services/school-holidays.service';
import { FormsModule } from '@angular/forms';
import { CustomLabelsService } from './services/custom-labels/custom-labels.service';
import { CustomLabelsDataService } from './services/custom-labels/custom-labels-data.service';
import { CustomTagComponent } from './day/custom-tag/custom-tag.component';
import { CustomTagsService } from './services/custom-tags/custom-tags.service';
import { CustomLabelsDataLocalStorageService } from './services/custom-labels/custom-labels-data-local-storage.service';
import { MaterialModule } from '../material.module';
import { WeeksComponent } from '../weeks/weeks.component';
import { WeekComponent } from '../weeks/week/week.component';
import { WeekDayComponent } from '../weeks/week-day/week-day.component';
import { DataBaseComponent } from '../data-base/data-base.component';

@NgModule({
  declarations: [
    DayComponent,
    MonthComponent,
    WeeksComponent,
    WeekDayComponent,
    WeekComponent,
    YearComponent,
    CustomTagComponent,
    DataBaseComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule
  ],
  providers: [
    SpecialDaysService,
    EasterProvider,
    JeuneGenevoisProvider,
    SchoolHolidaysService,
    CustomLabelsService,
    { provide: CustomLabelsDataService, useClass: CustomLabelsDataLocalStorageService },
    CustomTagsService
  ]
})
export class YearsModule { }

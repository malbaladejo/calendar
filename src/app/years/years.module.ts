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
import { YearNavigationComponent } from './year-navigation/year-navigation.component';
import { YearNavigationService } from './services/year-navigation.service';

@NgModule({
  declarations: [
    DayComponent,
    MonthComponent,
    YearComponent,
    CustomTagComponent,
    YearNavigationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule
  ],
  exports: [
    YearNavigationComponent
  ],
  providers: [
    SpecialDaysService,
    EasterProvider,
    JeuneGenevoisProvider,
    SchoolHolidaysService,
    CustomLabelsService,
    { provide: CustomLabelsDataService, useClass: CustomLabelsDataLocalStorageService },
    CustomTagsService,
    YearNavigationService
  ]
})
export class YearsModule { }

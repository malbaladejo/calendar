import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { EasterProvider } from './services/easter-provider';
import { SpecialDaysService } from './services/specialdays.service';
import { JeuneGenevoisProvider } from './services/jeune-genevois-provider';
import { SchoolHolidaysService } from './services/school-holidays.service';
import { FormsModule } from '@angular/forms';
import { CustomLabelsService } from './services/custom-labels/custom-labels.service';
import { CustomLabelsDataService } from './services/custom-labels/custom-labels-data.service';
import { CustomTagsService } from './services/custom-tags/custom-tags.service';
import { MaterialModule } from '../material.module';
import { MonthComponent } from './month/month.component';
import { CustomLabelsDataRemoteService } from './services/custom-labels/custom-labels-data-remote.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    MonthComponent
  ],
  providers: [
    SpecialDaysService,
    EasterProvider,
    JeuneGenevoisProvider,
    SchoolHolidaysService,
    CustomLabelsService,
    { provide: CustomLabelsDataService, useClass: CustomLabelsDataRemoteService },
    CustomTagsService
  ]
})
export class YearsModule { }

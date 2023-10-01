import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EasterProvider } from './services/easter-provider';
import { SpecialDaysService } from './services/specialdays.service';
import { DayComponent } from './day/day.component';
import { MonthComponent } from './month/month.component';
import { YearComponent } from './year/year.component';
import { JeuneGenevoisProvider } from './services/jeune-genevois-provider';
import { SchoolHolidaysService } from './services/school-holidays.service';
import { FormsModule } from '@angular/forms';
import { CustomLabelsService } from './services/custom-labels/custom-labels.service';
import { DateService } from './services/date-service';
import { CustomLabelsDataService } from './services/custom-labels/custom-labels-data.service';
import { CustomLabelsDataLocalStorageService } from './services/custom-labels/custom-labels-data-local-storage.service';
import { CustomTagComponent } from './day/custom-tag/custom-tag.component';

@NgModule({
  declarations: [
    AppComponent,
    DayComponent,
    MonthComponent,
    YearComponent,
    CustomTagComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    SpecialDaysService,
    EasterProvider,
    JeuneGenevoisProvider,
    SchoolHolidaysService,
    CustomLabelsService,
    { provide: CustomLabelsDataService, useClass: CustomLabelsDataLocalStorageService },
    DateService],
  bootstrap: [AppComponent]
})
export class AppModule { }

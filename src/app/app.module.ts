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

@NgModule({
  declarations: [
    AppComponent,
    DayComponent,
    MonthComponent,
    YearComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    SpecialDaysService,
    EasterProvider,
    JeuneGenevoisProvider,
    SchoolHolidaysService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { DateService } from './services/date-service';
import { YearsModule } from './years/years.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { ScheduleModule } from './schedule/schedule.module';
import { UidService } from './services/uid.service';
import { ArrayService } from './services/array-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    YearsModule,
    ScheduleModule
  ],
  providers: [
    DateService,
    UidService,
    ArrayService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

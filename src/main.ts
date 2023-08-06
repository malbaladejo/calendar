import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import {  routes } from './app/app-routing.module';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './app/material.module';
import { YearsModule } from './app/years/years.module';
import { DateService } from './app/services/date-service';
import { UidService } from './app/services/uid.service';
import { POST_IT_SERVICE } from './app/services/post-it/post-it.interface.service';
import { PostItService } from './app/services/post-it/post-it.impl.service';
import { AUTH_SERVICE_TOKEN } from './app/services/remote/auth.service';
import { AuthImplService } from './app/services/remote/impl/auth.impl.service';
import { CALENDAR_SERVICE_TOKEN } from './app/services/remote/calendar.service';
import { CalendarImplService } from './app/services/remote/impl/calendar.impl.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/services/remote/impl/auth-interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      FormsModule,
      MaterialModule,
      YearsModule,
    ),
    provideAnimations(),
    DateService,
    UidService,
    { provide: POST_IT_SERVICE, useClass: PostItService },
    { provide: AUTH_SERVICE_TOKEN, useClass: AuthImplService },
    { provide: CALENDAR_SERVICE_TOKEN, useClass: CalendarImplService },
    provideHttpClient(withInterceptors([authInterceptor])),
  ]
});
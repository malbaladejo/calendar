import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { DateService } from './services/date-service';
import { UidService } from './services/uid.service';
import { POST_IT_SERVICE } from './services/post-it/post-it.interface.service';
import { PostItService } from './services/post-it/post-it.impl.service';
import { AUTH_SERVICE_TOKEN } from './services/remote/auth.service';
import { AuthImplService } from './services/remote/impl/auth.impl.service';
import { CALENDAR_SERVICE_TOKEN } from './services/remote/calendar.service';
import { CalendarImplService } from './services/remote/impl/calendar.impl.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/remote/impl/auth-interceptor';

import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { YearsModule } from './years/years.module';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
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
};

import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DateService } from './services/date-service';
import { UidService } from './services/uid.service';
import { POST_IT_SERVICE } from './services/post-it/post-it.interface.service';
import { AUTH_SERVICE_TOKEN } from './services/remote/auth.service';
import { CALENDAR_SERVICE_TOKEN } from './services/remote/calendar.service';
import { PostItService } from './services/post-it/post-it.impl.service';
import { AuthImplService } from './services/remote/impl/auth.impl.service';
import { CalendarImplService } from './services/remote/impl/calendar.impl.service';
import { authInterceptor } from './services/remote/impl/auth-interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideHttpClient(withInterceptors([authInterceptor])),
        DateService,
        UidService,
        { provide: POST_IT_SERVICE, useClass: PostItService },
        { provide: AUTH_SERVICE_TOKEN, useClass: AuthImplService },
        { provide: CALENDAR_SERVICE_TOKEN, useClass: CalendarImplService },
    ]
};
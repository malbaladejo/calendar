
import { InjectionToken } from '@angular/core';
import { RemoteCustomLabel } from './models/remote-custom-label';

export const CALENDAR_SERVICE_TOKEN = new InjectionToken<CalendarService>('CalendarService');

export interface CalendarService {
    getLabelsAsync(beginDate: Date, endDate: Date): Promise<RemoteCustomLabel[]>;

    createLabelAsync(label: RemoteCustomLabel): Promise<RemoteCustomLabel>;

    massUploadAsync(labels: RemoteCustomLabel[]): Promise<RemoteCustomLabel[]>;
}
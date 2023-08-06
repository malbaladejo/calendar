import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarService } from '../calendar.service';
import { RemoteCustomLabel } from '../models/remote-custom-label';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CalendarImplService implements CalendarService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'api/Calendar';

    public getLabelsAsync(beginDate: Date, endDate: Date): Promise<RemoteCustomLabel[]> {

        const url = `${this.baseUrl}?beginDate=${beginDate.toISOString()}&endDate=${endDate.toISOString()}`

        return firstValueFrom(this.http.get<RemoteCustomLabel[]>(url, {
            withCredentials: true
        }));
    }

    public createLabelAsync(label: RemoteCustomLabel): Promise<RemoteCustomLabel> {
        return firstValueFrom(this.http.post<RemoteCustomLabel>(this.baseUrl, label, {
            withCredentials: true
        }));
    }

    public massUploadAsync(labels: RemoteCustomLabel[]): Promise<RemoteCustomLabel[]> {
        return firstValueFrom(this.http.post<RemoteCustomLabel[]>(`${this.baseUrl}/massupload`, labels, {
            withCredentials: true
        }));
    }
}
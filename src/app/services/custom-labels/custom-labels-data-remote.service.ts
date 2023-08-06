import { Injectable } from '@angular/core';
import { CustomLabel } from './custom-label';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomLabelsDataService } from './custom-labels-data.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomLabelsDataRemoteService extends CustomLabelsDataService {
  private readonly url = 'Calendar';
  private key = "123-456";

  constructor(private readonly httpClient: HttpClient) {
    super();
  }


  public async getDataAsync(year: number): Promise<CustomLabel[]> {
    let Params = new HttpParams();
    Params = Params.append('key', this.key);
    Params = Params.append('year', year);

    const results = await lastValueFrom(this.httpClient.get<CustomLabel[]>(this.url, { params: Params }));

    const items = new Array<CustomLabel>();
    for (const value of results) {
      items.push({
        date: new Date(value.date),
        label: value.label
      });
    }
    return items;
  }

  public async setLabelAsync(date: Date, label: string): Promise<void> {
    const payload = {
      key: this.key,
      data: {
        date,
        label
      }
    };

    await lastValueFrom(this.httpClient.post(this.url, payload));
  }
}

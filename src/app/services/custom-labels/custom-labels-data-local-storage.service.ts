import { Injectable } from '@angular/core';
import { DateService } from '../date-service';
import { CustomLabel } from './custom-label';
import { CustomLabelsDataService } from './custom-labels-data.service';

@Injectable({
  providedIn: 'root'
})
export class CustomLabelsDataLocalStorageService extends CustomLabelsDataService {

  constructor(private readonly dateService: DateService) {
    super();
  }

  public async getDataAsync(year: number): Promise<CustomLabel[]> {
    const yearData = localStorage.getItem(year.toString());
    if (yearData) {
      const rawItems = JSON.parse(yearData) as CustomLabel[];

      const items = new Array<CustomLabel>();

      for (const rawItem of rawItems) {
        items.push({
          date: new Date(rawItem.date),
          label: rawItem.label
        })
      }

      return items;
    }

    return new Array<CustomLabel>();
  }

  public async setLabelAsync(date: Date, label: string): Promise<void> {
    const year = date.getFullYear();
    const items = await this.getDataAsync(year);

    if (!label) {
      const newItems = items?.filter(l => !this.dateService.dateEquals(l.date, date));

      const json = JSON.stringify(newItems);
      localStorage.setItem(year.toString(), json);
      return;
    }

    const labelItem = items?.find(l => this.dateService.dateEquals(l.date, date));
    if (!labelItem) {
      items?.push({ date, label });
    }
    else {
      labelItem.label = label;
    }

    const json = JSON.stringify(items);
    localStorage.setItem(year.toString(), json);
  }
}

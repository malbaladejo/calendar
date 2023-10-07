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
          label: rawItem.label,
          tag: rawItem.tag
        })
      }

      return items;
    }

    return new Array<CustomLabel>();
  }

  public async saveDataAsync(year: number, items: CustomLabel[]): Promise<void> {
    const json = JSON.stringify(items);
    localStorage.setItem(year.toString(), json);
  }
}

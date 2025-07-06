import { Injectable } from '@angular/core';
import { CustomLabel } from './custom-label';
import { CustomLabelsDataService } from './custom-labels-data.service';

@Injectable({
  providedIn: 'root'
})
export class CustomLabelsDataLocalStorageService implements CustomLabelsDataService {
  private _calendateNameKey = 'calendare-name';

  public async getDataAsync(year: number): Promise<CustomLabel[]> {
    const yearData = localStorage.getItem(year.toString());
    if (yearData) {
      return this.parseData(yearData);
    }

    return new Array<CustomLabel>();
  }

  public parseData(data: string): CustomLabel[] {
    const rawItems = JSON.parse(data) as CustomLabel[];

    const items = new Array<CustomLabel>();

    for (const rawItem of rawItems) {
      items.push({
        date: new Date(rawItem.date),
        label: rawItem.label,
        tag: rawItem.tag,
        color: rawItem.color,
        style: rawItem.style
      })
    }

    return items;
  }

  public async saveDataAsync(year: number, items: CustomLabel[]): Promise<void> {
    const json = JSON.stringify(items);
    localStorage.setItem(year.toString(), json);
  }

  public async getAllYearsAsync(): Promise<number[]> {
    const years: number[] = [];

    const regex = /^([0-9]{4})$/gm;

    for (let key of Object.keys(localStorage)) {
      if (key.match(regex)) {
        years.push(parseInt(key));
      }
    }

    return years;
  }

  public getCalendarName(): string | null {
    return localStorage.getItem(this._calendateNameKey);
  }

  public setCalendarName(name: string): void {
    localStorage.setItem(this._calendateNameKey, name);
  }
}

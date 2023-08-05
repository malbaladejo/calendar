import { Injectable } from '@angular/core';
import { DateService } from '../date-service';
import { CustomLabel } from './custom-label';
import { CustomLabelsDataService } from './custom-labels-data.service';

@Injectable({
  providedIn: 'root'
})
export class CustomLabelsService {
  private customLabels = new Map<number, CustomLabel[]>();

  constructor(private readonly dateService: DateService, private readonly customLabelsDataService: CustomLabelsDataService) { }

  public async ensureDataAsync(date: Date): Promise<void> {
    const year = date.getFullYear();
    if (this.customLabels.get(year)) {
      return;
    }

    const yearData = await this.customLabelsDataService.getDataAsync(year);
    this.customLabels.set(year, yearData);
  }

  public getLabel(date: Date): string | undefined {
    const year = date.getFullYear();
    const items = this.customLabels.get(year);

    if (date.getMonth() === 0 && date.getDate() == 10) {

      console.log("test");

    }

    try {
      return items?.find(l => this.dateService.dateEquals(l.date, date))?.label;
    }
    catch (e) {
      console.error(e);
      throw e;
    }
  }

  public async setLabelAsync(date: Date, label: string): Promise<void> {
    await this.customLabelsDataService.setLabelAsync(date, label);

    const year = date.getFullYear();
    const items = this.customLabels.get(year);

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

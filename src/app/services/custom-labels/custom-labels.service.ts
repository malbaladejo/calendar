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

    try {
      return this.getItem(date)?.label;
    }
    catch (e) {
      console.error(e);
      throw e;
    }
  }

  public getItems(year: number): CustomLabel[] {
    const items = this.customLabels.get(year);

    return items ?? new Array<CustomLabel>();
  }

  public getItem(date: Date): CustomLabel | undefined {
    const year = date.getFullYear();
    const items = this.customLabels.get(year);

    return items?.find(l => this.dateService.dateEquals(l.date, date));
  }

  public async setLabelAsync(date: Date, label: string): Promise<void> {
    let labelItem = this.getItemOrDefault(date);
    labelItem.label = label;
    await this.saveItemAsync(labelItem);
  }

  public async setTagAsync(date: Date, tag: string): Promise<void> {
    let labelItem = this.getItemOrDefault(date);
    labelItem.tag = tag;
    await this.saveItemAsync(labelItem);
  }

  private getItemOrDefault(date: Date): CustomLabel {
    let labelItem = this.getItem(date);

    return labelItem ?? { date: date };
  }

  private async saveItemAsync(item: CustomLabel): Promise<void> {
    const year = item.date.getFullYear();
    const items = this.getItems(year);
    if (await this.removeItemAsync(item, items)) {
      return;
    }

    if (await this.addItemAsync(item, items)) {
      return;
    }

    await this.updateItemAsync(item, items);
  }

  private async removeItemAsync(item: CustomLabel, items: CustomLabel[]): Promise<boolean> {
    const year = item.date.getFullYear();
    if (item.label || item.tag) {
      return false;
    }

    const newItems = items.filter(l => !this.dateService.dateEquals(l.date, item.date));

    await this.saveItemsAsync(year, newItems);
    return true;
  }

  private async addItemAsync(item: CustomLabel, items: CustomLabel[]): Promise<boolean> {
    const year = item.date.getFullYear();

    const savedItem = this.getItem(item.date);

    if (savedItem) {
      return false;
    }

    items.push(item);
    await this.saveItemsAsync(year, items);
    return true;
  }

  private async updateItemAsync(item: CustomLabel, items: CustomLabel[]): Promise<boolean> {
    const year = item.date.getFullYear();

    items.push(item);
    await this.saveItemsAsync(year, items);
    return true;
  }

  private async saveItemsAsync(year: number, items: CustomLabel[]): Promise<void> {
    const json = JSON.stringify(items);
    localStorage.setItem(year.toString(), json);
  }
}

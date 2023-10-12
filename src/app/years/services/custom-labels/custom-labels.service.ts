import { Injectable } from '@angular/core';
import { DateService } from '../../../services/date-service';
import { CustomLabel } from './custom-label';
import { CustomLabelsDataService } from './custom-labels-data.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomLabelsService {
  private customLabels = new Map<number, CustomLabel[]>();
  private _onChangedSubject = new Subject<Date>();

  constructor(private readonly dateService: DateService, private readonly customLabelsDataService: CustomLabelsDataService) { }

  public async ensureDataAsync(date: Date): Promise<void> {
    const year = date.getFullYear();
    if (this.customLabels.get(year)) {
      return;
    }

    const yearData = await this.customLabelsDataService.getDataAsync(year);
    this.customLabels.set(year, yearData);
  }

  public onChanged(): Observable<Date> {
    return this._onChangedSubject.asObservable();
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

  public async setColorAsync(date: Date, color: string): Promise<void> {
    let labelItem = this.getItemOrDefault(date);
    labelItem.color = color;
    await this.saveItemAsync(labelItem);
  }

  public async setStyleAsync(date: Date, style: string): Promise<void> {
    let labelItem = this.getItemOrDefault(date);
    labelItem.style = style;
    await this.saveItemAsync(labelItem);
  }

  private getItemOrDefault(date: Date): CustomLabel {
    let labelItem = this.getItem(date);

    return labelItem ?? { date: date };
  }

  private async saveItemAsync(item: CustomLabel): Promise<void> {
    try {
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
    finally {
      this._onChangedSubject.next(item.date);
    }
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

    await this.saveItemsAsync(year, items);
    return true;
  }

  private async saveItemsAsync(year: number, items: CustomLabel[]): Promise<void> {
    const target = this.cleanItems(year, items);
    const json = JSON.stringify(target);
    localStorage.setItem(year.toString(), json);
  }

  private cleanItems(year: number, source: CustomLabel[]): CustomLabel[] {
    this.saveBeforeClean(year, source);
    const target = new Array<CustomLabel>();

    for (let item of source) {
      if (!target.find(l => this.dateService.dateEquals(l.date, item.date))) {
        target.push(item);
      }
    }

    return target;
  }

  private saveBeforeClean(year: number, source: CustomLabel[]): void {
    const key = `${year.toString()}-saved-01`;
    const savedData = localStorage.getItem(key);
    if (savedData) {
      return;
    }

    localStorage.setItem(key, JSON.stringify(source));
  }
}

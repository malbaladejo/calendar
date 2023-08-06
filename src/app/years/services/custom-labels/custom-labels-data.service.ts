import { Injectable } from '@angular/core';
import { CustomLabel } from './custom-label';

@Injectable({
  providedIn: 'root'
})
export abstract class CustomLabelsDataService {

  public abstract getDataAsync(year: number): Promise<CustomLabel[]>;

  public abstract saveDataAsync(year: number, item: CustomLabel): Promise<CustomLabel| null>;

  public abstract getAllYearsAsync(): Promise<number[]>;

  public abstract getCalendarName(): string | null;

  public abstract setCalendarName(name: string): void;

  public abstract parseData(data: string): CustomLabel[];
}

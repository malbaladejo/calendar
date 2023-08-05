import { Injectable } from '@angular/core';
import { CustomLabel } from './custom-label';

@Injectable({
  providedIn: 'root'
})
export abstract class CustomLabelsDataService {

  public abstract getDataAsync(year: number): Promise<CustomLabel[]>;

  public abstract setLabelAsync(date: Date, label: string): Promise<void>;
}

import { Component, OnInit } from '@angular/core';
import { CustomLabelsService } from '../years/services/custom-labels/custom-labels.service';

@Component({
  selector: 'app-data-base',
  templateUrl: './data-base.component.html',
  styleUrl: './data-base.component.scss',
  standalone: false
})
export class DataBaseComponent implements OnInit {
  private _years: number[] = [];
  private _name: string | null = '';

  constructor(private readonly customLabelService: CustomLabelsService) {

  }

  public get years(): number[] {
    return this._years;
  }

  public get name(): string | null {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
    this.customLabelService.setCalendarName(value);
  }

  public async ngOnInit(): Promise<void> {
    this._years = await this.customLabelService.getAllYearsAsync();
    await this.customLabelService.ensureDataForAllYearAsync();

    this._name = this.customLabelService.getCalendarName() ?? 'mon-calendrier';
  }

  public convertToFile(year: number): string {
    const data = JSON.stringify(this.customLabelService.getItems(year), null, '  ');
    return `data:application/json;charset=utf-8,${encodeURIComponent(data)}`
  }

  public getFileName(year: number): string {

    let fileName = 'calendar-'
    if (this._name) {
      fileName += this._name + '-';
    }

    fileName += `${year}-`;

    fileName += this.formatDate();
    fileName += '.json';

    return fileName;
  }

  private formatDate(): string {
    const now = new Date();
    let date = '';
    date += now.getFullYear();
    date += '-' + this.padLeft(now.getMonth() + 1);
    date += '-' + this.padLeft(now.getDate());
    date += '-' + this.padLeft(now.getHours());
    date += '-' + this.padLeft(now.getMinutes());
    date += '-' + this.padLeft(now.getSeconds());
    return date;
  }

  private padLeft(value: number): string {
    return value.toString().padStart(2, '0');
  }
}

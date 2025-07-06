import { Component, OnInit } from '@angular/core';
import { CustomLabelsService } from '../years/services/custom-labels/custom-labels.service';
import { CustomLabelsDataService } from '../years/services/custom-labels/custom-labels-data.service';
import { Y } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-data-base',
  templateUrl: './data-base.component.html',
  styleUrl: './data-base.component.scss',
  standalone: false
})
export class DataBaseComponent implements OnInit {
  private _years: number[] = [];
  private _name: string | null = '';

  constructor(
    private readonly customLabelService: CustomLabelsService,
    private readonly customLabelsDataService: CustomLabelsDataService) {

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

    this._years = this._years.sort((y1, y2) => y2 - y1);
    await this.customLabelService.ensureDataForAllYearAsync();

    this._name = this.customLabelService.getCalendarName() ?? 'mon-calendrier';
  }

  public convertToFile(year: number): string {
    const data = JSON.stringify(this.customLabelService.getItems(year), null, '  ');
    return `data:application/json;charset=utf-8,${encodeURIComponent(data)}`
  }

  public getFileName(year: number): string {
    let fileName = `calendar-${year}-${this.formatDate()}.json`;

    return fileName;
  }

  public onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const file = files[0];

    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt: ProgressEvent<FileReader>) => {
        const json = evt?.target?.result as string;
        if (json) {
          const data = this.customLabelsDataService.parseData(json);
          if (data && data.length > 0) {
            console.log(data[0].date.getFullYear());
          }
        }
      }
      reader.onerror = (evt: ProgressEvent<FileReader>) => {
        console.error("error reading file");
      }
    }
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

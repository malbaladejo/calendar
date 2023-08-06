import { Component, Inject, OnInit, signal } from '@angular/core';
import { CustomLabelsService } from '../years/services/custom-labels/custom-labels.service';
import { CustomLabelsDataService } from '../years/services/custom-labels/custom-labels-data.service';
import { Y } from '@angular/cdk/keycodes';
import { MatAnchor, MatButtonModule } from "@angular/material/button";
import { CustomLabelsDataLocalStorageService } from '../years/services/custom-labels/custom-labels-data-local-storage.service';
import { CALENDAR_SERVICE_TOKEN, CalendarService } from '../services/remote/calendar.service';
import { DateService } from '../services/date-service';
import { RemoteCustomLabel } from '../services/remote/models/remote-custom-label';

@Component({
  selector: 'app-data-base',
  templateUrl: './data-base.component.html',
  styleUrl: './data-base.component.scss',
  standalone: true,
  imports: [
    MatAnchor,
    MatButtonModule]
})
export class DataBaseComponent implements OnInit {
  //private _years: number[] = [];
  private _name: string | null = '';
  private readonly _customLabelService: CustomLabelsService;
  constructor(
    @Inject(CALENDAR_SERVICE_TOKEN) private readonly _calendarService: CalendarService) {
    this._customLabelService = new CustomLabelsService(new DateService(), new CustomLabelsDataLocalStorageService());
  }

  public readonly years = signal<number[]>([]);
  public readonly message = signal('');
  public readonly dataToImport = signal('');

  public set name(value: string) {
    this._name = value;
    this._customLabelService.setCalendarName(value);
  }

  public async ngOnInit(): Promise<void> {
    let years = await this._customLabelService.getAllYearsAsync();

    years = years.sort((y1, y2) => y2 - y1);
    await this._customLabelService.ensureDataForAllYearAsync();

    this.years.set(years);

    this._name = this._customLabelService.getCalendarName() ?? 'mon-calendrier';
  }

  public convertToFile(year: number): string {
    const data = JSON.stringify(this._customLabelService.getItems(year), null, '  ');
    return `data:application/json;charset=utf-8,${encodeURIComponent(data)}`
  }

  public onTextareaInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.dataToImport.set(value);
  }

  public getFileName(year: number): string {
    let fileName = `calendar-${year}-${this.formatDate()}.json`;

    return fileName;
  }

  public import(year: number) {
    const data = JSON.stringify(this._customLabelService.getItems(year), null, '  ');
    this.dataToImport.set(data);
  }

  public async massUploadAsync(): Promise<void> {
    if (!this.dataToImport()) {
      return;
    }
    this.message.set('');

    try {
      this.message.set('Import en cours. Le traitement peut prendre quelques secondes.');
      const data = JSON.parse(this.dataToImport()) as RemoteCustomLabel[];
      await this._calendarService.massUploadAsync(data);
      this.message.set('Données importées.');
    }
    catch (e) {
      console.error('Error during mass upload', e);
      this.message.set('Les données n\'ont pas été importées');
    }
  }

  // public onFileSelected(event: Event): void {
  //   const target = event.target as HTMLInputElement;
  //   const files = target.files as FileList;
  //   const file = files[0];

  //   if (file) {
  //     var reader = new FileReader();
  //     reader.readAsText(file, "UTF-8");
  //     reader.onload = (evt: ProgressEvent<FileReader>) => {
  //       const json = evt?.target?.result as string;
  //       if (json) {
  //         const data = this.customLabelsDataService.parseData(json);
  //         if (data && data.length > 0) {
  //           console.log(data[0].date.getFullYear());
  //         }
  //       }
  //     }
  //     reader.onerror = (evt: ProgressEvent<FileReader>) => {
  //       console.error("error reading file");
  //     }
  //   }
  // }

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

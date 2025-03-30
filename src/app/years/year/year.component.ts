import { Component } from '@angular/core';
import { CustomLabelsService } from '../services/custom-labels/custom-labels.service';
import { SchoolHolidaysService } from '../services/school-holidays.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.scss']
})
export class YearComponent {
  private _date?: Date = new Date();
  private _firstMonth = 0;
  private _numberOfMonthesPerScreen = 6;
  public months = new Array<Date>();

  constructor(
    private readonly schoolHolidaysService: SchoolHolidaysService,
    private readonly customLabelsService: CustomLabelsService,
    settingsService: SettingsService) {

    this._numberOfMonthesPerScreen = settingsService.numberOfMonthesPerScreen();
    this.initializeFirstMonth();
    this.buildMonthsAsync();
  }

  public get date(): Date | undefined {
    return this._date;
  }

  public set date(value: Date | undefined) {
    this._date = value;
  }

  public get year(): Number {
    return this.date?.getFullYear() ?? 0;
  }

  private initializeFirstMonth(): void {
    this.date = this.addMonth(new Date(), -1);
    this._firstMonth = this.date.getMonth();
    this.date = new Date(this.date.getFullYear(), this._firstMonth, 1);
  }

  private async buildMonthsAsync(): Promise<void> {
    if (!this.date) {
      return;
    }

    console.log("buildMonthsAsync:" + this.date);
    await this.schoolHolidaysService.ensureDataAsync(this.date);
    await this.customLabelsService.ensureDataAsync(this.date);

    this.months.splice(0);

    for (let month = this._firstMonth; month < this._firstMonth + this._numberOfMonthesPerScreen; month++) {
      const monthVM = new Date(this.date.getFullYear(), month, 1);
      this.months.push(monthVM);
    }
  }

  public previousMonth(): Promise<void> {
    return this.navigateToMonth(-1);
  }

  public previousSemester(): Promise<void> {
    return this.navigateToMonth(-this._numberOfMonthesPerScreen);
  }

  public nextMonth(): Promise<void> {
    return this.navigateToMonth(1);
  }

  public nextSemester(): Promise<void> {
    return this.navigateToMonth(this._numberOfMonthesPerScreen);
  }

  private async navigateToMonth(nbMonthes: number): Promise<void> {
    if (!this.date) {
      return;
    }

    console.info(`navigateToMonth(${this.date}, ${nbMonthes})`);

    this.date = this.addMonth(this.date, nbMonthes);
    this._firstMonth = this.date.getMonth();

    await this.buildMonthsAsync();
  }

  private addMonth(date: Date, nbOfMonthes: number): Date {
    return new Date(date.setMonth(date.getMonth() + nbOfMonthes));
  }
}

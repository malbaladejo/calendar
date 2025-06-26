import { Component } from '@angular/core';
import { CustomLabelsService } from '../services/custom-labels/custom-labels.service';
import { SchoolHolidaysService } from '../services/school-holidays.service';

@Component({
    selector: 'app-year',
    templateUrl: './year.component.html',
    styleUrls: ['./year.component.scss'],
    standalone: false
})
export class YearComponent {
  private _date?: Date = new Date();
  private _firstMonth = 0;
  public months = new Array<Date>();

  constructor(
    private readonly schoolHolidaysService: SchoolHolidaysService,
    private readonly customLabelsService: CustomLabelsService) {

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

    for (let month = this._firstMonth; month < this._firstMonth + 6; month++) {
      const monthVM = new Date(this.date.getFullYear(), month, 1);
      this.months.push(monthVM);
    }
  }

  public previousMonth(): Promise<void> {
    return this.navigateToMonth(-1);
  }

  public previousSemester(): Promise<void> {
    return this.navigateToMonth(-6);
  }

  public nextMonth(): Promise<void> {
    return this.navigateToMonth(1);
  }

  public nextSemester(): Promise<void> {
    return this.navigateToMonth(6);
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

import { Component, Input } from '@angular/core';
import { CustomLabelsService } from '../services/custom-labels/custom-labels.service';
import { SchoolHolidaysService } from '../services/school-holidays.service';

@Component({
  selector: 'app-year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.scss']
})
export class YearComponent {
  private _date?: Date = new Date();
  private _firstMonth = 0;
  public months = new Array<Date>();

  constructor(
    private readonly schoolHolidaysService: SchoolHolidaysService,
    private readonly customLabelsService: CustomLabelsService) {
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

  public async previous(): Promise<void> {
    if (!this.date) {
      return;
    }

    if (this._firstMonth === 0) {
      this._firstMonth = 6;
      this.date = new Date(this.date.getFullYear() - 1, 0, 1);
    }
    else {
      this._firstMonth = 0;
    }

    await this.buildMonthsAsync();
  }

  public async next(): Promise<void> {
    if (!this.date) {
      return;
    }

    if (this._firstMonth === 0) {
      this._firstMonth = 6;
    }
    else {
      this._firstMonth = 0;
      this.date = new Date(this.date.getFullYear() + 1, 0, 1);
    }

    console.log("next:" + this.date);
    await this.buildMonthsAsync();
  }
}

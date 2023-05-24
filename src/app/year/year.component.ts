import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.scss']
})
export class YearComponent {
  private _date?: Date = new Date();
  private _firstMonth = 0;
  public months = new Array<Date>();
  constructor() {
    this.buildMonths();
  }

  public get firstMonth(): number {
    return this._firstMonth;
  }

  @Input()
  public set firstMonth(value: number) {
    this._firstMonth = value;
    this.buildMonths();
  }

  public get date(): Date | undefined {
    return this._date;
  }

  @Input()
  public set date(value: Date | undefined) {
    this._date = value;
    this.buildMonths();
  }


  public get year(): Number {
    return this.date?.getFullYear() ?? 0;
  }

  private buildMonths(): void {
    if (!this.date) {
      return;
    }

    this.months.splice(0);
    for (let month = this.firstMonth; month < this.firstMonth + 6; month++) {
      const monthVM = new Date(this.date.getFullYear(), month, 1);
      this.months.push(monthVM);
    }
  }

  public previous(): void {
    if (!this.date) {
      return;
    }

    if (this.firstMonth === 0) {
      this.firstMonth = 6;
      this.date = new Date(this.date.getFullYear() - 1, 0, 1);
    }
    else {
      this.firstMonth = 0;
    }
    this.buildMonths();
  }

  public next(): void {
    if (!this.date) {
      return;
    }

    if (this.firstMonth === 0) {
      this.firstMonth = 6;
    }
    else {
      this.firstMonth = 0;
      this.date = new Date(this.date.getFullYear() + 1, 0, 1);
    }
    this.buildMonths();
  }
}

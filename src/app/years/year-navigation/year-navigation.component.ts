import { Component } from '@angular/core';
import { YearNavigationService } from '../services/year-navigation.service';

@Component({
  selector: 'app-year-navigation',
  templateUrl: './year-navigation.component.html',
  styleUrls: ['./year-navigation.component.scss']
})
export class YearNavigationComponent {
  private _date?: Date = new Date();
  public months = new Array<Date>();

  constructor(private readonly yearNavigationService: YearNavigationService) {

    //this.initializeFirstMonth();
  }

  public get date(): Date | undefined {
    return this._date;
  }

  public set date(value: Date | undefined) {
    this._date = value;
    this.yearNavigationService.date = value;
  }

  public get year(): Number {
    return this.date?.getFullYear() ?? 0;
  }

  // private initializeFirstMonth(): void {
  //   const currentMonth = (this.date ?? new Date()).getMonth();
  //   this._firstMonth = currentMonth < 6 ? 0 : 6;
  // }

  public async previous(): Promise<void> {
    if (!this.date) {
      return;
    }

    if (this.date.getMonth() === 0) {
      this.date = new Date(this.date.getFullYear() - 1, 6, 1);
    }
    else {
      this.date = new Date(this.date.getFullYear(), 0, 1);
    }

  }

  public async next(): Promise<void> {
    if (!this.date) {
      return;
    }

    if (this.date.getMonth() === 0) {
      this.date = new Date(this.date.getFullYear(), 6, 1);
    }
    else {
      this.date = new Date(this.date.getFullYear() + 1, 0, 1);
    }

    console.log("next:" + this.date);
  }
}

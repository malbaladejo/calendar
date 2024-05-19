import { Component, OnDestroy } from '@angular/core';
import { CustomLabelsService } from '../services/custom-labels/custom-labels.service';
import { SchoolHolidaysService } from '../services/school-holidays.service';
import { YearNavigationService } from '../services/year-navigation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.scss']
})
export class YearComponent implements OnDestroy {
  private _date?: Date = new Date();
  private _firstMonth = 0;
  private readonly _dateSubscription: Subscription;

  public months = new Array<Date>();

  constructor(
    private readonly schoolHolidaysService: SchoolHolidaysService,
    private readonly customLabelsService: CustomLabelsService,
    private readonly yearNavigationService: YearNavigationService) {

    this.initializeFirstMonth();
    this.buildMonthsAsync();

    this._dateSubscription = this.yearNavigationService.date$.subscribe(d => this.onDateChange(d));

    this.testReflection<MyClass>((t) => t.id);
  }

  private testReflection<T>(prop: (t: T) => void) {
    const func = prop.toString();
    const result = /^[^{]+{\s+return\s{1}[a-zA-Z]+\.(?<propertyName>[^;]*);\s+}$/gm.exec(func);
    console.log(result?.groups);
  }

  public ngOnDestroy(): void {
    this._dateSubscription.unsubscribe();
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

  private onDateChange(newDate: Date | undefined): void {
    if (!newDate) {
      this.initializeFirstMonth();
    } else {
      this._firstMonth = newDate.getMonth();
      this.date = newDate;
    }

    this.buildMonthsAsync();
  }

  private initializeFirstMonth(): void {
    const currentDate = this.date ?? new Date();

    const currentMonth = currentDate.getMonth();
    this._firstMonth = currentMonth < 6 ? 0 : 6;

    this.yearNavigationService.date = new Date(currentDate.getFullYear(), this._firstMonth, 1);
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
}

class MyClass {

  constructor(public id: string, public name: string) {


  }

  private _item = new MySubClass();
  public get item(): MySubClass {
    return this._item;
  }

  public set item(value: MySubClass) {
    this._item = value;
  }
}

class MySubClass {
  public test = '';
  public num = 0;
}

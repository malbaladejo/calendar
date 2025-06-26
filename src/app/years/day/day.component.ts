import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CustomLabelsService } from '../services/custom-labels/custom-labels.service';
import { SchoolHolidaysService } from '../services/school-holidays.service';
import { SpecialDaysService } from '../services/specialdays.service';
import { Subscription } from 'rxjs';
import { DateService } from 'src/app/services/date-service';

@Component({
    selector: 'app-day',
    templateUrl: './day.component.html',
    styleUrls: ['./day.component.scss'],
    standalone: false
})
export class DayComponent implements OnInit, OnDestroy {
  private _date?: Date;
  private dayInitials = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  private _isHoliday = false;
  private _isBackToSchool = false;
  private _label = '';
  private _specialLabel = '';
  private _color = '';
  private _style = '';
  private subscription?: Subscription;
  private _focused = false;

  constructor(
    private readonly specialDaysService: SpecialDaysService,
    private readonly schoolHolidaysService: SchoolHolidaysService,
    private readonly customLabelsService: CustomLabelsService,
    private readonly dateService: DateService) {

  }

  public ngOnInit(): void {
    this.subscription = this.customLabelsService.onChanged().subscribe(d => this.onChanged(d));
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public get date(): Date | undefined {
    return this._date;
  }

  @Input()
  public set date(value: Date | undefined) {
    this._date = value;
    this.loadHolidayAsync();
  }

  public get dayOfWeek(): string {
    if (!this.date) {
      return '';
    }
    return this.dayInitials[this.date.getDay()];
  }

  public get label(): string {
    if (this._focused) {
      return this._label;
    } else {
      return this._label !== '' ? this._label : this._specialLabel;
    }
  }

  public set label(value: string) {
    this._label = value;

    if (this.date) {
      this.customLabelsService.setLabelAsync(this.date, value);
    }
  }

  public get specialLabel(): string {
    return this._specialLabel;
  }

  public get color(): string {
    return this._color;
  }

  public get style(): string {
    return this._style;
  }

  public get isHoliday(): boolean {
    return this._isHoliday;
  }

  public set isHoliday(value: boolean) {
    this._isHoliday = value;
  }

  public get isBackToSchool(): boolean {
    return this._isBackToSchool;
  }

  public set isBackToSchool(value: boolean) {
    this._isBackToSchool = value;
  }

  public get isSaturday(): boolean {
    if (!this.date) {
      return false;
    }
    return this.date.getDay() == 6;
  }

  public get isSunday(): boolean {
    if (!this.date) {
      return false;
    }
    return this.date.getDay() == 0;
  }

  public get isPassed(): boolean {
    if (!this.date) {
      return false;
    }

    return this.date < new Date();
  }

  public get specialLabelVisible(): boolean {
    if (!this._focused) {
      return this._label !== '' && this._specialLabel !== '';
    }

    return this._specialLabel !== '';
  }

  public get isFrance(): boolean {
    if (!this.date) {
      return false;
    }
    return this.specialDaysService.getLabel(this.date)?.france ?? false;
  }

  public get isSuisse(): boolean {
    if (!this.date) {
      return false;
    }

    return this.specialDaysService.getLabel(this.date)?.suisse ?? false;
  }

  public onLabelFocusInEvent(): void {
    this._focused = true;
    if (!this._label) {
      this._label = this._specialLabel;
    }
  }

  public onLabelFocusOutEvent(): void {
    this._focused = false;

    if (this._label === this._specialLabel) {
      this._label = '';
    }
  }

  private onChanged(date: Date): void {
    if (this.dateService.dateEquals(this._date, date)) {
      this.buildLabel();
    }
  }

  private async loadHolidayAsync(): Promise<void> {
    if (!this.date) {
      return;
    }

    this.isHoliday = await this.schoolHolidaysService.isHolidayAsync(this.date);

    if (!this.isHoliday) {
      this.isBackToSchool = await this.schoolHolidaysService.isHolidayAsync(this.addDays(this.date, -1));
    }

    this.buildLabel();
  }

  private buildLabel(): void {
    this.buildCustomLabel();

    if (this.buildBackToSchoolLabel()) {
      return;
    }

    if (this.buildSpecialDaysLabel()) {
      return;
    }
  }

  private buildBackToSchoolLabel(): boolean {
    if (this.isBackToSchool) {
      this._specialLabel = 'RENTRÉE CLASSE';
      return true;
    }

    return false;
  }

  private buildSpecialDaysLabel(): boolean {
    if (!this.date) {
      return false;
    }

    this._specialLabel = this.specialDaysService.getLabel(this.date)?.label ?? '';

    if (this._specialLabel) {
      return true;
    }

    return false;
  }

  private buildCustomLabel(): boolean {
    if (!this.date) {
      return false;
    }

    const item = this.customLabelsService.getItem(this.date);
    this._label = item?.label ?? '';
    this._color = item?.color ?? '';
    this._style = item?.style ?? '';
    if (this._label) {
      return true;
    }

    return false;
  }

  private addDays(date: Date | undefined, days: number): Date {
    if (!date)
      return new Date();
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }
}

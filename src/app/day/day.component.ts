import { Component, Input } from '@angular/core';
import { SchoolHolidaysService } from '../services/school-holidays.service';
import { SpecialDaysService } from '../services/specialdays.service';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent {
  private _date?: Date;
  private dayInitials = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  private _isHoliday = false;
  private _isBackToSchool = false;
  private _label = '';
  constructor(
    private readonly specialDaysService: SpecialDaysService,
    private readonly schoolHolidaysService: SchoolHolidaysService) {

  }

  public get date(): Date | undefined {
    return this._date;
  }

  @Input()
  public set date(value: Date | undefined) {
    this._date = value;
    this.loadHolidayAsync();
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

  public get dayOfMonth(): string {
    if (!this.date) {
      return '';
    }
    return this.date.getDate().toString();
  }

  public get dayOfWeek(): string {
    if (!this.date) {
      return '';
    }
    return this.dayInitials[this.date.getDay()];
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

  public get isSpecialDay(): boolean {
    return this.label != '';
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

  public get label(): string {
    return this._label;
  }

  public set label(value: string) {
    this._label = value;
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
    if (!this.date) {
      return;
    }

    if (this.isBackToSchool) {
      this.label = 'RENTRÉE CLASSE'
      return;
    }

    this.label = this.specialDaysService.getLabel(this.date)?.label ?? '';
  }

  private addDays(date: Date | undefined, days: number): Date {
    if (!date)
      return new Date();
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }
}

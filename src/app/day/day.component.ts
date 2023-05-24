import { Component, Input } from '@angular/core';
import { SpecialDaysService } from '../services/specialdays.service';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent {
  private _date?: Date;
  private dayInitials = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  constructor(private specialDaysService: SpecialDaysService) {

  }

  public get date(): Date | undefined {
    return this._date;
  }

  @Input()
  public set date(value: Date | undefined) {
    this._date = value;
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
    if (!this.date) {
      return '';
    }
    return this.specialDaysService.getLabel(this.date)?.label ?? '';
  }
}

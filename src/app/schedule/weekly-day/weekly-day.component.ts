import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-weekly-day',
  templateUrl: './weekly-day.component.html',
  styleUrls: ['./weekly-day.component.scss']
})
export class WeeklyDayComponent {
  private readonly dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  private _dayOfWeek = 0;
  private _times?= new Array<Date>();

  public get dayOfWeek(): number {
    return this._dayOfWeek;
  }

  @Input()
  public set dayOfWeek(value: number) {
    this._dayOfWeek = value;
  }

  public get dayName(): string {
    return this.dayNames[this._dayOfWeek];
  }

  @Input()
  public set times(values: Date[] | undefined) {
    this._times = values;
  }

  public get times(): Date[] | undefined {
    return this._times;
  }


}

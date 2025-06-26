import { Component, Input } from '@angular/core';
import { DateService } from 'src/app/services/date-service';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrl: './week.component.scss',
  standalone: false
})
export class WeekComponent {
  private _date?: Date;
  private _dates = [] as Date[];
  private monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"
  ];

  constructor(private readonly dateService: DateService) {

  }

  public get date(): Date | undefined {
    return this._date;
  }

  @Input()
  public set date(value: Date | undefined) {
    this._date = value;
    this.buildDays();
  }

  public get name(): string {
    if (!this.date) {
      return '';
    }

    const startMonth = this.date.getMonth();
    const startYear = this.date.getFullYear();
    const endDate = this.dateService.addDays(this.date, 7);

    const endMonth = endDate.getMonth();
    const endYear = endDate.getFullYear();

    if (startMonth === endMonth && startYear === endYear) {
      return `${this.monthNames[startMonth]} ${startYear}`;
    }

    if (startMonth !== endMonth && startYear === endYear) {
      return `${this.monthNames[startMonth]} - ${this.monthNames[endMonth]} ${startYear}`;
    }

    return `${this.monthNames[startMonth]} ${startYear} - ${this.monthNames[endMonth]} ${endYear}`;

  }

  public get days(): Date[] {
    return this._dates;
  }

  private buildDays(): void {
    if (!this._date) {
      return;
    }

    for (let i = 0; i < 7; i++) {
      const day = this.dateService.addDays(this._date, i);
      this._dates.push(day);
    }
  }
}

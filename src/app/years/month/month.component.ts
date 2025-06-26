import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-month',
    templateUrl: './month.component.html',
    styleUrls: ['./month.component.scss'],
    standalone: false
})
export class MonthComponent {
  private _date?: Date;
  public days: Array<Date | undefined> = new Array<Date | undefined>();
  private monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"
  ];

  public get date(): Date | undefined {
    return this._date;
  }

  @Input()
  public set date(value: Date | undefined) {
    this._date = value;
    this.buildDays();
  }

  public get monthNumber(): number | undefined {
    return this.date?.getMonth();
  }

  public get pair(): boolean {
    return ((this.monthNumber ?? 0) + 1) % 2 === 0;
  }

  public get name(): string {
    if (!this.date) {
      return '';
    }
    return `${this.monthNames[this.date.getMonth()]} ${this.date.getFullYear()}`;
  }

  private buildDays(): void {
    if (!this.date) {
      return;
    }

    const days = new Array<Date | undefined>();
    let date = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
    while (date.getMonth() == this.date.getMonth()) {
      days.push(this.cloneDate(date));
      date.setDate(date.getDate() + 1);
    }

    let i = days.length;
    for (i; i < 31; i++) {
      days.push(undefined);
    }

    this.days = days;
  }

  private cloneDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}

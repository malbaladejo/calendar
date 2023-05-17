import { DayViewModel, EmptyDayViewModel } from './day-viewmodel';

export class MonthViewModel {
    private _days: Array<DayViewModel> = new Array<DayViewModel>();
    private monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"
    ];

    constructor(public date: Date) {
        this._days = this.buildDays();
    }

    public get days(): Array<DayViewModel> {
        return this._days;
    }

    public get name(): string {
        return `${this.monthNames[this.date.getMonth()]} ${this.date.getFullYear()}`;
    }

    private buildDays(): Array<DayViewModel> {
        const days = new Array<DayViewModel>();
        let date = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
        while (date.getMonth() == this.date.getMonth()) {
            days.push(new DayViewModel(this.cloneDate(date)));
            date.setDate(date.getDate() + 1);
        }

        let i = days.length;
        for (i; i < 31; i++) {
            days.push(new EmptyDayViewModel());
        }

        return days;
    }

    private cloneDate(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
}
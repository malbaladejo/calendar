import { MonthViewModel } from './month-viewmodel';

export class YearViewModel {
    private readonly _months = new Array<MonthViewModel>();

    constructor(public date: Date, private firstMonth: number) {
        this.buildMonths();
    }

    public get year(): Number {
        return this.date.getFullYear();
    }

    public get months(): Array<MonthViewModel> {
        return this._months;
    }

    private buildMonths(): void {
        this._months.splice(0);
        for (let month = this.firstMonth; month < this.firstMonth + 6; month++) {
            const monthVM = new MonthViewModel(new Date(this.date.getFullYear(), month, 1));
            this._months.push(monthVM);
        }
    }

    public previous(): void {
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
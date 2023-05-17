import { SpecialDaysService } from '../services/specialdays.service';

export class DayViewModel {
    private dayInitials = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    private readonly specialdaysService = new SpecialDaysService();

    constructor(public date: Date) {

    }

    public get dayOfMonth(): string {
        return this.date.getDate().toString();
    }

    public get dayOfWeek(): string {
        return this.dayInitials[this.date.getDay()];
    }

    public get isSaturday(): boolean {
        return this.date.getDay() == 6;
    }

    public get isSunday(): boolean {
        return this.date.getDay() == 0;
    }

    public get isSpecialDay(): boolean {
        return this.label != '';
    }

    public get isFrance(): boolean {
        return this.specialdaysService.getLabel(this.date)?.france ?? false;
    }

    public get isSuisse(): boolean {
        return this.specialdaysService.getLabel(this.date)?.suisse ?? false;
    }

    public get label(): string {
        return this.specialdaysService.getLabel(this.date)?.label ?? '';
    }
}

export class EmptyDayViewModel extends DayViewModel {
    constructor() {
        super(new Date());
    }

    public override get dayOfMonth(): string {
        return '';
    }

    public override get dayOfWeek(): string {
        return '';
    }

    public override get isSaturday(): boolean {
        return false;
    }

    public override get isSunday(): boolean {
        return false;
    }

    public override get isSpecialDay(): boolean {
        return false;
    }

    public override get label(): string {
        return '';
    }
}
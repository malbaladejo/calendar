export class SpecialDay {
    constructor(
        public date: Date,
        public label: string,
        public france: boolean,
        public suisse: boolean) { }

    public static create(
        day: number, month: number, year: number,
        label: string, france: boolean, suisse: boolean): SpecialDay {
        return new SpecialDay(new Date(year, month - 1, day), label, france, suisse);
    }
}
export class TimeSlot {
    public text = '';
    public color = 'blue';
    public day = 0;
    public begin = new Date();
    public end = new Date();
}

export interface ITimeSlotJSON {
    text: string;
    color: string;
    day: number;
    begin: string;
    end: string;
}

export class TimeSlotMapper {
    public static map(source: ITimeSlotJSON): TimeSlot {
        const target = new TimeSlot();
        target.text = source.text;
        target.color = source.color;
        target.day = source.day;
        target.begin = new Date(source.begin);
        target.end = new Date(source.end);

        return target;
    }

    public static mapList(source: ITimeSlotJSON[]): TimeSlot[] {
        return source.map(s => TimeSlotMapper.map(s));
    }
}
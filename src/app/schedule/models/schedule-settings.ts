export class ScheduleSettings {
    public days = [0, 1, 2, 3, 4, 5, 6];
    public minHours = new Date('2000-01-01T08:00:00');
    public maxHours = new Date('2000-01-01T20:00:00');
}

export interface IScheduleSettingsJSON {
    days: Array<number>;
    minHours: string;
    maxHours: string;
}

export class ScheduleSettingsMapper {
    public static map(source: IScheduleSettingsJSON): ScheduleSettings {
        const target = new ScheduleSettings();
        target.days = source.days;
        target.minHours = new Date(source.minHours);
        target.maxHours = new Date(source.maxHours);
        return target;
    }
}
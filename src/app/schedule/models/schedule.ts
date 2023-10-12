import { IScheduleSettingsJSON, ScheduleSettings, ScheduleSettingsMapper } from "./schedule-settings";
import { ITimeSlotJSON, TimeSlot, TimeSlotMapper } from "./time-slot";

export class Schedule {
    public id = '';
    public title = '';
    public settings = new ScheduleSettings();
    public timeSlots = new Array<TimeSlot>();
}

export interface IScheduleJSON {
    id: string;
    title: string;
    settings: IScheduleSettingsJSON;
    timeSlots: Array<ITimeSlotJSON>;
}

export class ScheduleMapper {
    public static map(source: IScheduleJSON): Schedule {
        const target = new Schedule();
        target.id = source.id;
        target.title = source.title;
        target.settings = ScheduleSettingsMapper.map(source.settings);
        target.timeSlots = TimeSlotMapper.mapList(source.timeSlots);
        return target;
    }
}
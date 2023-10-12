import { Injectable } from '@angular/core';
import { ScheduleInfo } from '../models/schedule-info';
import { Schedule } from '../models/schedule';

@Injectable({
  providedIn: 'root'
})
export abstract class ScheduleDataService {

  public abstract getScheduleInfos(): ScheduleInfo[];

  public abstract saveScheduleInfos(scheduleInfos: ScheduleInfo[]): void;

  public abstract getSchedule(id: string): Schedule | undefined;

  public abstract saveSchedule(schedule: Schedule): void;

  public abstract deleteSchedule(id: string): void;
}

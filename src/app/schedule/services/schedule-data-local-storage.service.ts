import { Injectable } from '@angular/core';
import { ScheduleDataService } from './schedule-data.service';
import { IScheduleJSON, Schedule, ScheduleMapper } from '../models/schedule';
import { ScheduleInfo } from '../models/schedule-info';

@Injectable({
  providedIn: 'root'
})
export class ScheduleDataLocalStorageService implements ScheduleDataService {
  private readonly scheduleInfosKey = 'schedules';
  private readonly scheduleFormatKey = 'schedule-';

  public getScheduleInfos(): ScheduleInfo[] {
    const scheduleInfosString = localStorage.getItem(this.scheduleInfosKey);
    if (!scheduleInfosString) {
      return [];
    }
    return JSON.parse(scheduleInfosString);
  }

  public saveScheduleInfos(scheduleInfos: ScheduleInfo[]): void {
    localStorage.setItem(this.scheduleInfosKey, JSON.stringify(scheduleInfos));
  }

  public getSchedule(id: string): Schedule | undefined {
    const scheduleString = localStorage.getItem(this.scheduleFormatKey + id);
    if (!scheduleString) {
      return undefined;
    }

    const scheduleJson = JSON.parse(scheduleString) as IScheduleJSON;
    return ScheduleMapper.map(scheduleJson);
  }

  public saveSchedule(schedule: Schedule): void {
    localStorage.setItem(this.scheduleFormatKey + schedule.id, JSON.stringify(schedule));
  }

  public deleteSchedule(id: string): void {
    localStorage.removeItem(this.scheduleFormatKey + id);
  }
}

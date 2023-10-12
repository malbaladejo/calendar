import { Injectable } from '@angular/core';
import { ScheduleDataService } from './schedule-data.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScheduleInfo } from '../models/schedule-info';
import { UidService } from 'src/app/services/uid.service';
import { Schedule } from '../models/schedule';
import { ArrayService } from 'src/app/services/array-service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private readonly scheduleInfoSubject = new BehaviorSubject<ScheduleInfo[]>([]);
  private readonly scheduleInfo$: Observable<ScheduleInfo[]>;

  private scheduleInfosInitialized = false;
  private scheduleInfos = new Array<ScheduleInfo>();

  constructor(
    private readonly scheduleDataService: ScheduleDataService,
    private readonly uidService: UidService,
    private readonly arrayService: ArrayService) {
    this.scheduleInfo$ = this.scheduleInfoSubject.asObservable();
  }

  public getScheduleInfos(): Observable<ScheduleInfo[]> {
    this.ensureScheduleInfos();
    return this.scheduleInfo$;
  }

  public getSchedule(id: string): Schedule | undefined {
    this.ensureScheduleInfos();
    return this.scheduleDataService.getSchedule(id);
  }

  public saveSchedule(schedule: Schedule): void {
    this.ensureScheduleInfos();

    let scheduleInfo = this.scheduleInfos.find(s => s.id === schedule.id);
    if (scheduleInfo) {
      scheduleInfo.title = schedule.title;
    }

    this.scheduleInfos = this.scheduleInfos.sort((a, b) => this.compareScheduleInfo(a, b));
    this.scheduleInfoSubject.next(this.scheduleInfos);
    this.scheduleDataService.saveScheduleInfos(this.scheduleInfos);
    this.scheduleDataService.saveSchedule(schedule);
    return this.scheduleDataService.saveSchedule(schedule);
  }

  public createSchedule(): Schedule {
    this.ensureScheduleInfos();
    var schedule = new Schedule();
    schedule.id = this.uidService.getUid();
    schedule.title = this.getScheduleNewName();
    this.scheduleInfos.push({
      id: schedule.id,
      title: schedule.title,
      favorite: false
    });

    this.saveSchedule(schedule);
    return schedule;
  }

  public deleteSchedule(id: string): void {
    this.ensureScheduleInfos();

    this.arrayService.removeItem(this.scheduleInfos, (item: ScheduleInfo) => item.id === id);

    this.scheduleInfoSubject.next(this.scheduleInfos);
    this.scheduleDataService.saveScheduleInfos(this.scheduleInfos);
    return this.scheduleDataService.deleteSchedule(id);
  }

  private compareScheduleInfo(a: ScheduleInfo, b: ScheduleInfo): number {
    {
      if (a.favorite) {
        return -1;
      }

      if (b.favorite) {
        return 1;
      }

      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    }
  }

  private getScheduleNewName(): string {
    let index = this.scheduleInfos.length + 1;
    let name = '';
    do {
      name = `Nouveau ${index}`;
      index++;
    } while (this.scheduleInfos.find(s => s.title === name))

    return name;
  }

  private ensureScheduleInfos(): void {
    if (this.scheduleInfosInitialized) {
      return;
    }

    this.scheduleInfos = this.scheduleDataService.getScheduleInfos();
    this.scheduleInfoSubject.next(this.scheduleInfos);

    this.scheduleInfosInitialized = true;
  }
}

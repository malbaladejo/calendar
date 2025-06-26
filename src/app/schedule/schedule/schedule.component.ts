import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../services/schedule.service';
import { Observable } from 'rxjs';
import { ScheduleInfo } from '../models/schedule-info';
import { Schedule } from '../models/schedule';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.scss'],
    standalone: false
})
export class ScheduleComponent implements OnInit {
  public scheduleInfos$?: Observable<ScheduleInfo[]>;

  private _scheduleInfo?: ScheduleInfo;
  private _schedule?: Schedule;

  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly route: ActivatedRoute,
    private readonly router: Router) {
  }

  public get scheduleInfo(): ScheduleInfo | undefined {
    return this._scheduleInfo;
  }

  public set scheduleInfo(value: ScheduleInfo | undefined) {
    this._scheduleInfo = value;
  }

  public get schedule(): Schedule | undefined {
    return this._schedule;
  }

  public ngOnInit(): void {
    this.scheduleInfos$ = this.scheduleService.getScheduleInfos();

    this.route.firstChild?.paramMap.subscribe(paramMap => {
      this.loadSchedule(paramMap.get('id') ?? '');
    });
  }

  public createSchedule(): void {
    this._schedule = this.scheduleService.createSchedule();
    this.navigateToSchedule(this._schedule.id);
  }

  public selectSchedule(id: string): void {
    this._schedule = this.scheduleService.getSchedule(id);
  }

  public loadSchedule(id: string): void {
    if (!id) {
      return;
    }
    this._schedule = this.scheduleService.getSchedule(id);

    if (this._schedule) {
      this.navigateToSchedule(this._schedule.id);
    }
  }

  private navigateToSchedule(id: string): void {
    this.router.navigate(['/emploi-du-temps', id]);

  }

}

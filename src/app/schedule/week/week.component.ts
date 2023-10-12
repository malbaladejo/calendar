import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { DateService } from 'src/app/services/date-service';
import { Schedule } from '../models/schedule';
import { ScheduleService } from '../services/schedule.service';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent implements OnInit {
  public minHours = new Date('2000-01-01T08:00:00');
  public maxHours = new Date('2000-01-01T20:00:00');
  public daysOfWeek = [1, 2, 3, 4, 5, 6, 0];
  public title = '';

  private schedule?: Schedule;

  constructor(
    private readonly dateService: DateService,
    private readonly scheduleService: ScheduleService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) {

  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.loadSchedule(paramMap.get('id') ?? '');
    });
  }

  public get times(): Date[] {
    const values = new Array<Date>();

    let date = this.minHours;
    do {
      values.push(date);
      date = this.dateService.addMinutes(date, 30)
    } while (date < this.maxHours)

    return values;
  }

  private loadSchedule(id: string): void {
    this.schedule = this.scheduleService.getSchedule(id);
    if (!this.schedule) {
      this.router.navigate(['/emploi-du-temps']);
      return;
    }

    this.minHours = this.schedule.settings.minHours;
    this.maxHours = this.schedule.settings.maxHours;
    this.daysOfWeek = this.schedule.settings.days;
    this.title = this.schedule.title;
  }
}

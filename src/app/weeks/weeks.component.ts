import { Component, OnInit } from '@angular/core';
import { DateService } from '../services/date-service';
import { SchoolHolidaysService } from '../years/services/school-holidays.service';
import { CustomLabelsService } from '../years/services/custom-labels/custom-labels.service';

@Component({
  selector: 'app-weeks',
  templateUrl: './weeks.component.html',
  styleUrl: './weeks.component.scss',
  standalone: false
})
export class WeeksComponent implements OnInit {
  public weeks = [] as Date[];
  private readonly numberOfWeeks = 5;
  private firstDayOfCurrentWeek?: Date;

  constructor(private readonly dateService: DateService,
    private readonly schoolHolidaysService: SchoolHolidaysService,
    private readonly customLabelsService: CustomLabelsService) {

  }

  public get year(): number {
    return this.firstDayOfCurrentWeek?.getFullYear() ?? 0;
  }

  public async ngOnInit(): Promise<void> {
    await this.buildWeeksAsync(new Date());
  }

  private async buildWeeksAsync(date: Date): Promise<void> {
    this.weeks = [];
    this.firstDayOfCurrentWeek = this.dateService.getFirstDayOfWeek(date);

    await this.schoolHolidaysService.ensureDataAsync(this.firstDayOfCurrentWeek);
    await this.customLabelsService.ensureDataAsync(this.firstDayOfCurrentWeek);

    for (let i = 0; i < this.numberOfWeeks; i++) {
      const firstDayOfWeek = this.dateService.addDays(this.firstDayOfCurrentWeek, 7 * i);
      this.weeks.push(firstDayOfWeek);
    }
  }

  public previousWeek(): void {
    if (!this.firstDayOfCurrentWeek) {
      return;
    }

    this.buildWeeksAsync(this.dateService.addDays(this.firstDayOfCurrentWeek, -7));
  }

  public nextWeek(): void {
    if (!this.firstDayOfCurrentWeek) {
      return;
    }

    this.buildWeeksAsync(this.dateService.addDays(this.firstDayOfCurrentWeek, 7));
  }
}

import { Injectable } from '@angular/core';

interface Holiday {
  name: string;
  begin: Date;
  end: Date;
}

interface HolidayDto {
  name: string;
  begin: string;
  end: string;
}

@Injectable({
  providedIn: 'root'
})
export class SchoolHolidaysService {
  private holidays = new Map<string, Holiday[]>();

  constructor() { }

  public async isHolidayAsync(date: Date): Promise<boolean> {
    const year = date.getFullYear();

    const result = await this.isHolidayForYearAsync(date, this.getCacheKey(year - 1));
    if (result) {
      return true;
    }

    return await this.isHolidayForYearAsync(date, this.getCacheKey(year));
  }

  public async ensureDataAsync(date: Date): Promise<void> {
    const year = date.getFullYear();
    await this.isHolidayForYearAsync(date, this.getCacheKey(year - 1));
    await this.isHolidayForYearAsync(date, this.getCacheKey(year));
  }

  private getCacheKey(year: number): string {
    return `assets/school-holidays/${year}-${year + 1}.json`
  }

  private async isHolidayForYearAsync(date: Date, url: string): Promise<boolean> {
    const holidays = await this.getHolidays(url);

    for (let holiday of holidays) {
      if (this.compareDate(holiday.begin, date) <= 0 && this.compareDate(date, holiday.end) <= 0) {
        return true;
      }
    }

    return false;
  }

  private async getHolidays(url: string): Promise<Holiday[]> {
    let holidays = this.holidays.get(url);

    if (!holidays) {
      try {
        const result = await fetch(url);
        const json = await result.json();
        const holidayDtos = json as HolidayDto[];

        holidays = holidayDtos.map(d => {
          return {
            name: d.name,
            begin: new Date(Date.parse(d.begin)),
            end: this.addDays(new Date(Date.parse(d.end)), -1)
          };
        });

        this.holidays.set(url, holidays);
      }
      catch {
        this.holidays.set(url, []);
      }
    }

    return holidays ?? [];
  }

  private addDays(date: Date, days: number): Date {
    let clone = this.cloneDate(date);
    clone.setDate(date.getDate() + days);
    return clone;
  }

  private cloneDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private compareDate(date1: Date, date2: Date): number {
    if (date1.getFullYear() < date2.getFullYear()) {
      return -1;
    }

    if (date1.getFullYear() > date2.getFullYear()) {
      return 1;
    }

    if (date1.getMonth() < date2.getMonth()) {
      return -1;
    }

    if (date1.getMonth() > date2.getMonth()) {
      return 1;
    }

    if (date1.getDate() < date2.getDate()) {
      return -1;
    }

    if (date1.getDate() > date2.getDate()) {
      return 1;
    }

    return 0;
  }
}

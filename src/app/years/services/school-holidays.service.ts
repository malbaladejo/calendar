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

  public async isFrenchHolidayAsync(date: Date): Promise<boolean> {
    const year = date.getFullYear();

    const result = await this.isHolidayForYearAsync(date, this.getFrenchUrl(year - 1));
    if (result) {
      return true;
    }

    return await this.isHolidayForYearAsync(date, this.getFrenchUrl(year));
  }

  public isFrenchHoliday(date: Date): boolean {
    const year = date.getFullYear();

    const result = this.isHolidayForYear(date, this.getFrenchUrl(year - 1));
    if (result) {
      return true;
    }

    return this.isHolidayForYear(date, this.getFrenchUrl(year));
  }

  public async isGenevaHolidayAsync(date: Date): Promise<boolean> {
    const year = date.getFullYear();

    const result = await this.isHolidayForYearAsync(date, this.getGenevaUrl(year - 1));
    if (result) {
      return true;
    }

    return await this.isHolidayForYearAsync(date, this.getGenevaUrl(year));
  }

  public isGenevaHoliday(date: Date): boolean {
    const year = date.getFullYear();

    const result = this.isHolidayForYear(date, this.getGenevaUrl(year - 1));
    if (result) {
      return true;
    }

    return this.isHolidayForYear(date, this.getGenevaUrl(year));
  }

  public async ensureDataAsync(date: Date): Promise<void> {
    const year = date.getFullYear();
    await this.isHolidayForYearAsync(date, this.getFrenchUrl(year - 1));
    await this.isHolidayForYearAsync(date, this.getFrenchUrl(year));

    await this.isHolidayForYearAsync(date, this.getGenevaUrl(year - 1));
    await this.isHolidayForYearAsync(date, this.getGenevaUrl(year));
  }

  private getFrenchUrl(year: number): string {
    return `assets/school-holidays/${year}-${year + 1}.json`
  }

  private getGenevaUrl(year: number): string {
    return `assets/school-holidays/ge-${year}-${year + 1}.json`
  }

  private isHolidayForYear(date: Date, url: string): boolean {
    const holidays = this.getHolidays(url);
    return this.isHoliday(date, holidays);
  }

  private async isHolidayForYearAsync(date: Date, url: string): Promise<boolean> {
    const holidays = await this.getHolidaysAsync(url);
    return this.isHoliday(date, holidays);
  }

  private isHoliday(date: Date, holidays: Holiday[]): boolean {
    for (let holiday of holidays) {
      if (this.compareDate(holiday.begin, date) <= 0 && this.compareDate(date, holiday.end) <= 0) {
        return true;
      }
    }

    return false;
  }



  private getHolidays(url: string): Holiday[] {
    let holidays = this.holidays.get(url);

    return holidays ?? [];
  }

  private async getHolidaysAsync(url: string): Promise<Holiday[]> {
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

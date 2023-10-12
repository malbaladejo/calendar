import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DateService {

    public addDays(date: Date | undefined, days: number): Date {
        if (!date)
            return new Date();
        return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
    }

    public addHours(date: Date | undefined, hours: number): Date {
        if (!date)
            return new Date();
        return new Date(date.getTime() + hours * 60 * 60 * 1000);
    }

    public addMinutes(date: Date | undefined, minutes: number): Date {
        if (!date)
            return new Date();
        return new Date(date.getTime() + minutes * 60 * 1000);
    }

    public dateEquals(date1: Date | undefined, date2: Date | undefined): boolean {
        if (!date1 || !date2) {
            return false;
        }

        return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
    }

    public isWeekend(date: Date): boolean {
        const day = date.getDay();

        return day === 0 || day === 7;
    }
}
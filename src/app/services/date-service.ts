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

    public dateEquals(date1: Date | undefined, date2: Date | undefined): boolean {
        if (!date1 || !date2) {
            return false;
        }

        return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
    }
}
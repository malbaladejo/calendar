import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DateService {
    private readonly dayInitials = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    private readonly monthesNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    public getDayInitials(date?: Date): string {
        if (!date) {
            return '';
        }
        return this.dayInitials[date.getDay()];
    }

    public getMonthName(date?: Date): string {
        if (!date) {
            return '';
        }
        return this.monthesNames[date.getMonth()];
    }

    public isSaturday(date?: Date): boolean {
        if (!date) {
            return false;
        }
        return date.getDay() == 6;
    }

    public isSunday(date?: Date): boolean {
        if (!date) {
            return false;
        }
        return date.getDay() == 0;
    }

    public isPassed(date?: Date): boolean {
        if (!date) {
            return false;
        }

        return date < this.getBeginOfDay(new Date());
    }

    public addDays(date: Date | undefined, days: number): Date {
        if (!date)
            return new Date();
        // DEBUG
        const dayDurationInMs = 86400000;
        return new Date(date.getTime() + days * dayDurationInMs);
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

    public getFirstDayOfWeek(date: Date): Date {
        var day = date.getDay(),
            diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(date.setDate(diff));
    }

    public getBeginOfDay(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    }

    public getEndOfDay(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    }
}
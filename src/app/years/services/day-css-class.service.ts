import { Injectable } from '@angular/core';
import { SpecialDaysService } from './specialdays.service';
import { SchoolHolidaysService } from './school-holidays.service';
import { DateService } from 'src/app/services/date-service';
import { S } from 'node_modules/@angular/material/icon-registry.d-BVwP8t9_';

@Injectable({
    providedIn: 'root'
})
export class DayCssClassService {
    constructor(
        private readonly specialDaysService: SpecialDaysService,
        private readonly schoolHolidaysService: SchoolHolidaysService,
        private readonly dateService: DateService) {
    }

    public async initializeAsync(date: Date) {
        this.schoolHolidaysService.ensureDataAsync(date);
    }

    public getCssClass(date: Date): string {
        if (this.isSaturday(date)) {
            return 'saturday';
        }

        if (this.isSunday(date)) {
            return 'sunday';
        }


    }

    public isSaturday(date: Date): boolean {
        return this.dateService.isSaturday(date);
    }

    public isSunday(date: Date): boolean {
        return this.dateService.isSunday(date);
    }

    public isPassed(date: Date): boolean {
        return this.dateService.isPassed(date);
    }

    public isFrenchPublicHoliday(date: Date): boolean {
        return this.specialDaysService.getLabel(date)?.france ?? false;
    }

    public isGenevaPublicHoliday(date: Date): boolean {
        return this.specialDaysService.getLabel(date)?.suisse ?? false;
    }

    public isFrenchSchoolHoliday(date: Date): boolean {
        return this.schoolHolidaysService.isFrenchHoliday(date);
    }

    public isPublicHoliday(date: Date): boolean {
        return this.isFrenchPublicHoliday(date) || this.isGenevaPublicHoliday(date);
    }

    public isGenevaSchoolHoliday(date: Date): boolean {
        return this.schoolHolidaysService.isGenevaHoliday(date);
    }

    public isSchoolHoliday(date: Date): boolean {
        return this.isFrenchSchoolHoliday(date) || this.isGenevaSchoolHoliday(date);
    }
}
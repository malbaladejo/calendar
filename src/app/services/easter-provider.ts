import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EasterProvider {
    public getEasterDate(year: number): Date {
        const a = year % 19
        const century = Math.floor(year / 100)
        const yearsAfterCentury = year % 100
        const d = (19 * a + century - Math.floor(century / 4) - Math.floor((Math.floor(century - (century + 8) / 25) + 1) / 3) + 15) % 30
        const e = (32 + 2 * (century % 4) + 2 * Math.floor(yearsAfterCentury / 4) - d - (yearsAfterCentury % 4)) % 7
        const f = d + e - 7 * Math.floor((a + 11 * d + 22 * e) / 451) + 114
        const month = Math.floor(f / 31)
        const day = (f % 31) + 1

        return new Date(year, month - 1, day);
    }
}
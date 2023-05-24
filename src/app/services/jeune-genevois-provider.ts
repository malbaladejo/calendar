import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class JeuneGenevoisProvider {
    public getJeuneGenevoisDate(year: number): Date {
        const firstSeptember = new Date(year, 8, 1);
        const dayOfFirstSeptember = firstSeptember.getDay();
        const firstSundayInNDays = (7 - dayOfFirstSeptember) % 7;
        const jeuneGenevoisInNDays = firstSundayInNDays + 4;
        const jeuneGenevois = new Date(year, 8, 1 + jeuneGenevoisInNDays);
        return jeuneGenevois;
    }
}
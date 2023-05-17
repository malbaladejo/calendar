import { Injectable } from '@angular/core';
import { SpecialDay } from './special-day';

@Injectable({
  providedIn: 'root'
})
export class SpecialDaysService {

  private easternDates = new Map<number, Date>();
  private saintFridayDates = new Map<number, Date>();
  private ascensionDates = new Map<number, Date>();
  private ascensionFridayDates = new Map<number, Date>();
  private pentecoteDates = new Map<number, Date>();
  private jeuneGenevoisDates = new Map<number, Date>();

  public getLabel(date: Date): SpecialDay | null {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (day === 31 && month === 12) {
      return new SpecialDay('RESTAURATION R.', false, true);
    }

    if (day === 1 && month === 1) {
      return new SpecialDay('JOUR DE L\'AN', true, true);
    }

    if (day === 2 && month === 1) {
      return new SpecialDay('LO', false, true);
    }

    if (day === 1 && month === 5) {
      return new SpecialDay('FETE DU TRAVAIL', true, false);
    }

    if (day === 8 && month === 5) {
      return new SpecialDay('ARMISTICE 1945', true, false);
    }

    if (day === 1 && month === 8) {
      return new SpecialDay('FETE NAT. SUISSE', false, true);
    }

    if (day === 1 && month === 11) {
      return new SpecialDay('TOUSSAINT', true, false);
    }

    if (day === 11 && month === 11) {
      return new SpecialDay('ARMISTICE 1918', true, false);
    }

    if (day === 24 && month === 12) {
      return new SpecialDay('LO', false, true);
    }

    if (day === 25 && month === 12) {
      return new SpecialDay('NOEL', true, true);
    }

    if (day === 26 && month === 12) {
      return new SpecialDay('LO', false, true);
    }

    this.buildEasternDates(year);
    if (this.dateEquals(date, this.saintFridayDates.get(year))) {
      return new SpecialDay("VENDREDI SAINT", false, true);
    }

    if (this.dateEquals(date, this.easternDates.get(year))) {
      return new SpecialDay("PAQUES", true, true);
    }

    if (this.dateEquals(date, this.ascensionDates.get(year))) {
      return new SpecialDay("ASCENSION", true, true);
    }

    if (this.dateEquals(date, this.ascensionFridayDates.get(year))) {
      return new SpecialDay("V. ASCENSION", true, false);
    }

    if (this.dateEquals(date, this.pentecoteDates.get(year))) {
      return new SpecialDay("PENTECOTE", true, true);
    }

    this.buildJeuneGenevois(year);
    if (this.dateEquals(date, this.jeuneGenevoisDates.get(year))) {
      return new SpecialDay("JEUNE GENEVOIS", false, true);
    }

    return null;
  }

  private buildEasternDates(year: number): void {
    let date = this.easternDates.get(year);
    if (date) {
      return;
    }

    date = this.buildEasternDate(year);
    this.easternDates.set(year, this.addDays(date, 1));
    this.saintFridayDates.set(year, this.addDays(date, -2));
    this.ascensionDates.set(year, this.addDays(date, 39));
    this.ascensionFridayDates.set(year, this.addDays(date, 40));
    this.pentecoteDates.set(year, this.addDays(date, 50));
  }

  private buildEasternDate(year: number): Date {
    const a = year % 19
    const century = Math.floor(year / 100)
    const yearsAfterCentury = year % 100
    const d = (19 * a + century - Math.floor(century / 4) - Math.floor((Math.floor(century - (century + 8) / 25) + 1) / 3) + 15) % 30
    const e = (32 + 2 * (century % 4) + 2 * Math.floor(yearsAfterCentury / 4) - d - (yearsAfterCentury % 4)) % 7
    const f = d + e - 7 * Math.floor((a + 11 * d + 22 * e) / 451) + 114
    const month = Math.floor(f / 31)
    const day = (f % 31) + 1

    return new Date(year, month - 1, day)
  }

  private buildJeuneGenevois(year: number) {
    let date = this.jeuneGenevoisDates.get(year);
    if (date) {
      return;
    }

    const firstSeptember = new Date(year, 8, 1);
    const dayOfFirstSeptember = firstSeptember.getDay();
    const firstSundayInNDays = (7 - dayOfFirstSeptember) % 7;
    const jeuneGenevoisInNDays = firstSundayInNDays + 4;
    const jeuneGenevois = new Date(year, 8, 1 + jeuneGenevoisInNDays);
    this.jeuneGenevoisDates.set(year, jeuneGenevois);
  }

  private addDays(date: Date | undefined, days: number): Date {
    if (!date)
      return new Date();
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }

  private dateEquals(date1: Date, date2: Date | undefined): boolean {
    if (!date2) {
      return false;
    }

    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
  }
}

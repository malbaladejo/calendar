import { Injectable } from '@angular/core';
import { EasterProvider } from './easter-provider';
import { JeuneGenevoisProvider } from './jeune-genevois-provider';
import { SpecialDay } from './special-day';

@Injectable({
  providedIn: 'root'
})
export class SpecialDaysService {

  private specilasDays = new Map<number, SpecialDay[]>();

  public getLabel(date: Date): SpecialDay | undefined {
    const specialDays = this.ensureSpecialDays(date.getFullYear());
    return specialDays.find(d => this.dateEquals(d.date, date));
  }

  private ensureSpecialDays(year: number): Array<SpecialDay> {
    const sp = this.specilasDays.get(year);
    if (sp) {
      return sp;
    }

    const specilasDays = new Array<SpecialDay>();
    specilasDays.push(SpecialDay.create(1, 1, year, 'JOUR DE L\'AN', true, true));
    specilasDays.push(SpecialDay.create(2, 1, year, 'LO', false, true));
    specilasDays.push(SpecialDay.create(1, 5, year, 'FETE DU TRAVAIL', true, false));
    specilasDays.push(SpecialDay.create(8, 5, year, 'ARMISTICE 1945', true, false));
    specilasDays.push(SpecialDay.create(1, 8, year, 'FETE NAT. SUISSE', false, true));
    specilasDays.push(SpecialDay.create(1, 11, year, 'TOUSSAINT', true, false));
    specilasDays.push(SpecialDay.create(11, 11, year, 'ARMISTICE 1918', true, false));
    specilasDays.push(SpecialDay.create(24, 12, year, 'LO', false, true));
    specilasDays.push(SpecialDay.create(25, 12, year, 'JOUR DE NOEL', true, true));
    specilasDays.push(SpecialDay.create(26, 12, year, 'LO', false, true));
    specilasDays.push(SpecialDay.create(31, 12, year, 'RESTAURATION', false, true));

    const easterDate = EasterProvider.getEasterDate(year);
    specilasDays.push(new SpecialDay(this.addDays(easterDate, -2), 'VENDREDI SAINT', false, true));
    specilasDays.push(new SpecialDay(this.addDays(easterDate, 1), 'LUNDI PAQUES', true, true));
    specilasDays.push(new SpecialDay(this.addDays(easterDate, 39), 'ASCENSION', true, true));
    specilasDays.push(new SpecialDay(this.addDays(easterDate, 40), 'V. ASCENSION', true, false));
    specilasDays.push(new SpecialDay(this.addDays(easterDate, 50), 'PENTECOTE', true, true));

    const jeuneGenevois = JeuneGenevoisProvider.getJeuneGenevoisDate(year);
    specilasDays.push(new SpecialDay(jeuneGenevois, 'JEUNE GENEVOIS', false, true));
    this.specilasDays.set(year, specilasDays);

    return specilasDays;
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

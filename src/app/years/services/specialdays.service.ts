import { Injectable } from '@angular/core';
import { DateService } from '../../services/date-service';
import { EasterProvider } from './easter-provider';
import { JeuneGenevoisProvider } from './jeune-genevois-provider';
import { SpecialDay } from './special-day';

@Injectable({
  providedIn: 'root'
})
export class SpecialDaysService {

  private specilasDays = new Map<number, SpecialDay[]>();

  constructor(
    private readonly easterProvider: EasterProvider,
    private readonly jeuneGenevoisProvider: JeuneGenevoisProvider,
    private readonly dateService: DateService) {
  }

  public getLabel(date: Date): SpecialDay | undefined {
    const specialDays = this.ensureSpecialDays(date.getFullYear());
    return specialDays.find(d => this.dateService.dateEquals(d.date, date));
  }

  private ensureSpecialDays(year: number): Array<SpecialDay> {
    const sp = this.specilasDays.get(year);
    if (sp) {
      return sp;
    }

    const specilasDays = new Array<SpecialDay>();
    specilasDays.push(SpecialDay.create(1, 1, year, 'JOUR DE L\'AN', true, true));

    this.ensureLOSpecialDays(2, 1, year, specilasDays);
    specilasDays.push(SpecialDay.create(1, 5, year, 'FETE DU TRAVAIL', true, false));
    specilasDays.push(SpecialDay.create(8, 5, year, 'ARMISTICE 1945', true, false));
    specilasDays.push(SpecialDay.create(1, 8, year, 'FETE NAT. SUISSE', false, true));
    specilasDays.push(SpecialDay.create(1, 11, year, 'TOUSSAINT', true, false));
    specilasDays.push(SpecialDay.create(11, 11, year, 'ARMISTICE 1918', true, false));
    this.ensureLOSpecialDays(24, 12, year, specilasDays);
    specilasDays.push(SpecialDay.create(25, 12, year, 'JOUR DE NOEL', true, true));
    this.ensureLOSpecialDays(26, 12, year, specilasDays);
    specilasDays.push(SpecialDay.create(31, 12, year, 'RESTAURATION', false, true));

    const easterDate = this.easterProvider.getEasterDate(year);
    specilasDays.push(new SpecialDay(this.dateService.addDays(easterDate, -2), 'VENDREDI SAINT', false, true));
    specilasDays.push(new SpecialDay(this.dateService.addDays(easterDate, 1), 'LUNDI PAQUES', true, true));
    specilasDays.push(new SpecialDay(this.dateService.addDays(easterDate, 39), 'ASCENSION', true, true));
    specilasDays.push(new SpecialDay(this.dateService.addDays(easterDate, 40), 'V. ASCENSION', true, false));
    specilasDays.push(new SpecialDay(this.dateService.addDays(easterDate, 50), 'PENTECOTE', true, true));

    const jeuneGenevois = this.jeuneGenevoisProvider.getJeuneGenevoisDate(year);
    specilasDays.push(new SpecialDay(jeuneGenevois, 'JEUNE GENEVOIS', false, true));
    this.specilasDays.set(year, specilasDays);

    return specilasDays;
  }

  private ensureLOSpecialDays(day: number, month: number, year: number, specilasDays: Array<SpecialDay>): void {
    const date = new Date(year, month - 1, day);
    if (this.dateService.isWeekend(date)) {
      return;
    }

    specilasDays.push(SpecialDay.create(day, month, year, 'LO', false, true));
  }
}

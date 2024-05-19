import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YearNavigationService {
  private readonly _dateSubject = new Subject<Date | undefined>();
  private _date?: Date;

  public get date(): Date | undefined {
    return this._date;
  }

  public set date(value: Date | undefined) {
    this._date = value;
    this._dateSubject.next(value);
  }

  public get date$(): Observable<Date | undefined> {
    return this._dateSubject.asObservable();
  }
}

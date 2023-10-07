import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomTagsService {

  private _tagOpened = new BehaviorSubject<Date | undefined>(undefined);

  constructor() { }

  public get tagOpened$(): Observable<Date | undefined> {
    return this._tagOpened.asObservable();
  }

  public openTag(value: Date): void {
    this._tagOpened.next(value);
  }
}

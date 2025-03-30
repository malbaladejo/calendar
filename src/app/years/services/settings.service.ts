import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    public numberOfMonthesPerScreen(): number {
        return 5;
    }
}
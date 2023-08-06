import { Inject, Injectable } from '@angular/core';
import { CustomLabel } from './custom-label';
import { CustomLabelsDataService } from './custom-labels-data.service';
import { CALENDAR_SERVICE_TOKEN, CalendarService } from 'src/app/services/remote/calendar.service';
import { PromiseCompletionSource } from 'src/app/services/promise-completion-source';
import { PromiseEx } from 'src/app/services/promise-ex';
import { CustomLabelMapper } from 'src/app/services/remote/mappers/custom-label.mapper';

@Injectable({
    providedIn: 'root'
})
export class CustomLabelsDataRemoteService extends CustomLabelsDataService {
    constructor(
        @Inject(CALENDAR_SERVICE_TOKEN) private readonly _calendarService: CalendarService) {
        super();
    }

    public override async getDataAsync(year: number): Promise<CustomLabel[]> {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31)
        const results = await this._calendarService.getLabelsAsync(startDate, endDate);

        return CustomLabelMapper.mapListBackToFront(results);
    }

    private _promiseCompletionSource?: PromiseCompletionSource;

    public override async saveDataAsync(year: number, item: CustomLabel): Promise<CustomLabel | null> {
        this._promiseCompletionSource?.cancel();
        this._promiseCompletionSource = new PromiseCompletionSource();
        return await this.saveDataOrCancelAsync(item, this._promiseCompletionSource);
    }

    private async saveDataOrCancelAsync(
        item: CustomLabel,
        promiseCompletionToken: PromiseCompletionSource): Promise<CustomLabel | null> {
        const delayInMs = 1000;
        await PromiseEx.delay(delayInMs);
        if (promiseCompletionToken.isCancellationRequested) {
            return null;
        }
        const backItems = CustomLabelMapper.mapFrontToBack(item);
        const remote = await this._calendarService.createLabelAsync(backItems);
        return CustomLabelMapper.mapBackToFront(remote);
    }

    public override getAllYearsAsync(): Promise<number[]> {
        throw new Error('Method not implemented.');
    }
    public override getCalendarName(): string | null {
        throw new Error('Method not implemented.');
    }
    public override setCalendarName(name: string): void {
        throw new Error('Method not implemented.');
    }
    public override parseData(data: string): CustomLabel[] {
        throw new Error('Method not implemented.');
    }
}

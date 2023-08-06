import { Injectable } from '@angular/core';
import { CustomLabel } from './custom-label';
import { CustomLabelsDataService } from './custom-labels-data.service';

@Injectable({
    providedIn: 'root'
})
export class CustomLabelsDataLocalStorageService implements CustomLabelsDataService {
    private _calendateNameKey = 'calendare-name';

    public async getDataAsync(year: number): Promise<CustomLabel[]> {
        const yearData = localStorage.getItem(year.toString());
        if (yearData) {
            return this.parseData(yearData);
        }

        return new Array<CustomLabel>();
    }

    public parseData(data: string): CustomLabel[] {
        const rawItems = JSON.parse(data) as CustomLabel[];

        const items = new Array<CustomLabel>();

        for (const rawItem of rawItems) {
            items.push({
                date: new Date(rawItem.date),
                label: rawItem.label,
                tag: rawItem.tag,
                color: rawItem.color,
                style: rawItem.style
            })
        }

        return items;
    }

    public async saveDataAsync(year: number, item: CustomLabel): Promise<CustomLabel | null> {
        // const json = JSON.stringify(items);
        // localStorage.setItem(year.toString(), json);
        throw ('not implemented');
    }

    public async getAllYearsAsync(): Promise<number[]> {
        const years: number[] = [];

        const regex = /^([0-9]{4})$/gm;

        for (let key of Object.keys(localStorage)) {
            if (key.match(regex)) {
                years.push(parseInt(key));
            }
        }

        return years;
    }

    public getCalendarName(): string | null {
        return localStorage.getItem(this._calendateNameKey);
    }

    public setCalendarName(name: string): void {
        localStorage.setItem(this._calendateNameKey, name);
    }


    // private async saveItemAsync(item: CustomLabel): Promise<void> {

    //     const year = item.date.getFullYear();
    //     const items = await this.getDataAsync(year);
    //     if (await this.removeItemAsync(item, items)) {
    //         return;
    //     }

    //     if (await this.addItemAsync(item, items)) {
    //         return;
    //     }

    //     await this.updateItemAsync(item, items);

    // }

    // private async removeItemAsync(item: CustomLabel, items: CustomLabel[]): Promise<boolean> {
    //     const year = item.date.getFullYear();
    //     if (item.label || item.tag) {
    //         return false;
    //     }

    //     const newItems = items.filter(l => !this.dateService.dateEquals(l.date, item.date));

    //     await this.saveItemsAsync(year, newItems);
    //     return true;
    // }

    // private async addItemAsync(item: CustomLabel, items: CustomLabel[]): Promise<boolean> {
    //     const year = item.date.getFullYear();

    //     const savedItem = this.getItem(item.date);

    //     if (savedItem) {
    //         return false;
    //     }

    //     items.push(item);
    //     await this.saveItemsAsync(year, items);
    //     return true;
    // }

    // private async updateItemAsync(item: CustomLabel, items: CustomLabel[]): Promise<boolean> {
    //     const year = item.date.getFullYear();

    //     await this.saveItemsAsync(year, items);
    //     return true;
    // }

    // private async saveItemsAsync(year: number, items: CustomLabel[]): Promise<void> {
    //     const target = this.cleanItems(year, items);
    //     // const json = JSON.stringify(target);

    //     this.saveDataAsync(year, items);
    //     //localStorage.setItem(year.toString(), json);
    // }

    // private cleanItems(year: number, source: CustomLabel[]): CustomLabel[] {
    //     this.saveBeforeClean(year, source);
    //     const target = new Array<CustomLabel>();

    //     for (let item of source) {
    //         if (!target.find(l => this.dateService.dateEquals(l.date, item.date))) {
    //             target.push(item);
    //         }
    //     }

    //     return target;
    // }

    // private saveBeforeClean(year: number, source: CustomLabel[]): void {
    //     const key = `${year.toString()}-saved-01`;
    //     const savedData = localStorage.getItem(key);
    //     if (savedData) {
    //         return;
    //     }

    //     localStorage.setItem(key, JSON.stringify(source));
    // }
}

import { Injectable } from "@angular/core";

@Injectable()
export class ArrayService {
    public removeItem<T>(items: T[], predicate: (item: T) => boolean): T[] {
        return items.filter(i => !predicate(i));
    }
}
import { Injectable } from "@angular/core";

export class ArrayService {
    public static removeItem<T>(items: T[], predicate: (item: T) => boolean): T[] {
        return items.filter(i => !predicate(i));
    }
}
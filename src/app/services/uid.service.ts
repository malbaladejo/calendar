import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UidService {
  private readonly uidLength = 10;
  private readonly characters = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  public getUid(): string {
    let uid = '';
    for (let i = 0; i < this.uidLength; i++) {
      const index = Math.floor(Math.random() * (this.characters.length));

      uid += this.characters[index];
    }
    return uid;
  }
}

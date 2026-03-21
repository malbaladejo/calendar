
export class UidService {
  private static readonly uidLength = 10;
  private static readonly characters = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  public static getUid(): string {
    let uid = '';
    for (let i = 0; i < UidService.uidLength; i++) {
      const index = Math.floor(Math.random() * (UidService.characters.length));

      uid += UidService.characters[index];
    }
    return uid;
  }


}

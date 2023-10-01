import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-tag',
  templateUrl: './custom-tag.component.html',
  styleUrls: ['./custom-tag.component.scss']
})
export class CustomTagComponent {
  private _date?: Date;
  private _colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  private _selectedColor = '';
  private _colorSelectorVisible = false;

  public get date(): Date | undefined {
    return this._date;
  }

  @Input()
  public set date(value: Date | undefined) {
    this._date = value;
  }

  public get dayOfMonth(): string {
    if (!this.date) {
      return '';
    }
    return this.date.getDate().toString();
  }

  public get colors(): string[] {
    return this._colors;
  }

  public get selectedColor(): string {
    return this._selectedColor;
  }

  public set selectedColor(value: string) {
    this._selectedColor = value;
  }

  public get colorSelectorVisible(): boolean {
    return this._colorSelectorVisible;
  }

  public set colorSelectorVisible(value: boolean) {
    this._colorSelectorVisible = value;
  }

  public toggleColorSelector(): void {
    this.colorSelectorVisible = !this.colorSelectorVisible;
  }

  public selectColor(color: string): void {
    this.selectedColor = color;
  }
}

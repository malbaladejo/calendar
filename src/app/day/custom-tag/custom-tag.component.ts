import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CustomTagsService } from 'src/app/services/custom-tags/custom-tags.service';
import { Subscription } from 'rxjs';
import { DateService } from 'src/app/services/date-service';
import { CustomLabelsService } from 'src/app/services/custom-labels/custom-labels.service';

@Component({
  selector: 'app-custom-tag',
  templateUrl: './custom-tag.component.html',
  styleUrls: ['./custom-tag.component.scss']
})
export class CustomTagComponent implements OnInit, OnDestroy {
  private _date?: Date;
  private _colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  private _selectedColor = '';
  private _colorSelectorVisible = false;

  private customTagsSubscription?: Subscription;

  constructor(
    private readonly customTagsService: CustomTagsService,
    private readonly customLabelService: CustomLabelsService,
    private readonly dateService: DateService) {

  }

  public ngOnInit(): void {
    this.customTagsSubscription = this.customTagsService.tagOpened$.subscribe((date) => {
      if (!this.dateService.dateEquals(this.date, date)) {
        this.colorSelectorVisible = false;
      }
    });
  }


  public ngOnDestroy(): void {
    this.customTagsSubscription?.unsubscribe();
  }

  public get date(): Date | undefined {
    return this._date;
  }

  @Input()
  public set date(value: Date | undefined) {
    this._date = value;

    if (this.date) {
      this.selectedColor = this.customLabelService.getItem(this.date)?.tag ?? '';
    }
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
    if (this.colorSelectorVisible && this.date) {
      this.customTagsService.openTag(this.date);
    }
  }

  public async selectColorAsync(color: string): Promise<void> {
    if (!this.date) {
      return;
    }

    this.selectedColor = color;
    await this.customLabelService.setTagAsync(this.date, color);
  }
}

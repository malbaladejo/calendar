import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CustomTagsService } from '../../services/custom-tags/custom-tags.service';
import { Subscription } from 'rxjs';
import { DateService } from '../../../services/date-service';
import { CustomLabelsService } from '../../services/custom-labels/custom-labels.service';

@Component({
  selector: 'app-custom-tag',
  templateUrl: './custom-tag.component.html',
  styleUrls: ['./custom-tag.component.scss']
})
export class CustomTagComponent implements OnInit, OnDestroy {
  private _date?: Date;
  private _colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  private _styles = ['bold', 'italic'];
  private _tagColor = '';
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

  @ViewChild('dayNumber', { static: false })
  public dayNumberElRef?: ElementRef;

  public get date(): Date | undefined {
    return this._date;
  }

  @Input()
  public set date(value: Date | undefined) {
    this._date = value;

    if (this.date) {
      const item = this.customLabelService.getItem(this.date);
      this.tagColor = item?.tag ?? '';
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

  public get styles(): string[] {
    return this._styles;
  }

  public get tagColor(): string {
    return this._tagColor;
  }

  public set tagColor(value: string) {
    this._tagColor = value;
  }

  public get colorSelectorVisible(): boolean {
    return this._colorSelectorVisible;
  }

  public set colorSelectorVisible(value: boolean) {
    this._colorSelectorVisible = value;
  }

  public toggleColorSelector(): void {

    if (this.dayNumberElRef) {
      const { x, y } = this.dayNumberElRef.nativeElement.getBoundingClientRect();
      console.log(`${x}, ${y}`)
    }

    this.colorSelectorVisible = !this.colorSelectorVisible;
    if (this.colorSelectorVisible && this.date) {
      this.customTagsService.openTag(this.date);
    }
  }

  public async selectTagColorAsync(color: string): Promise<void> {
    if (!this.date) {
      return;
    }

    this.tagColor = color;
    await this.customLabelService.setTagAsync(this.date, color);
  }

  public async selectForegroundColorAsync(color: string): Promise<void> {
    if (!this.date) {
      return;
    }

    await this.customLabelService.setColorAsync(this.date, 'color-' + color);
  }

  public async selectStyleAsync(style: string): Promise<void> {
    if (!this.date) {
      return;
    }

    await this.customLabelService.setStyleAsync(this.date, style);
  }
}

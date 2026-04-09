import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { PostItColor } from '../services/post-it/post-it-color';

@Component({
  selector: 'app-post-it-board',
  templateUrl: './popup-post-it-color-dialog.component.html',
  styleUrls: ['./popup-post-it-color-dialog.component.scss'],
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ],
})
export class PopupPostItColorDialogComponent {

  public readonly colors: Array<PostItColor>;

  constructor(private readonly _dialogRef: MatDialogRef<PopupPostItColorDialogComponent>) {
    this.colors = Object.values(PostItColor);
  }

  public onSelectColor(color: string): void {
    this._dialogRef.close(color);
  }

  public onClose(): void {
    this._dialogRef.close();
  }
}
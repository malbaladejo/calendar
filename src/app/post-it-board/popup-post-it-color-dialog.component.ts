import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-post-it-board',
  templateUrl: './popup-post-it-color-dialog.component.html',
  styleUrls: ['./popup-post-it-color-dialog.component.scss'],
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
})
export class PopupPostItColorDialogComponent {
  // readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  // readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  // readonly animal = model(this.data.animal);

  // public readonly color = model(this.data.animal);
  /**
   *
   */

  // ENHANCE enumarate PostItColor enum
  public readonly colors = [
    'yellow',
    'pink',
    'green',
    'blue',
    'orange',
    'purple',
    'red',
    'turquoise',
    'darkblue'
  ];

  constructor(private readonly _dialogRef: MatDialogRef<PopupPostItColorDialogComponent>) {

  }

  public onSelectColor(color: string): void {
    this._dialogRef.close(color);
  }

  public onClose(): void {
    this._dialogRef.close();
  }
}
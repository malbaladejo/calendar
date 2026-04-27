import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { IPostItService, POST_IT_SERVICE } from '../services/post-it/post-it.interface.service';
import { PostIt } from '../services/post-it/post-it';
import { ArrayService } from '../services/array-service';
import { MatDialog } from '@angular/material/dialog';
import { PopupPostItColorDialogComponent } from './popup-post-it-color-dialog.component';
import { PostItViewModel } from './post-it.viewmodel';
import { MatButtonModule } from '@angular/material/button';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Keys } from '../services/keys';

@Component({
  selector: 'app-post-it-board',
  templateUrl: './post-it-board.component.html',
  styleUrls: ['./post-it-board.component.scss'],
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule
  ]
})
export class PostItBoardComponent implements OnInit {
  private _postIts: Array<PostItViewModel> = [];
  private _selectedPostIt?: PostItViewModel;
  private _isCtrlPressed = false;

  constructor(
    @Inject(POST_IT_SERVICE) private _postItService: IPostItService,
    private _dialog: MatDialog,
    private readonly changeDetectorRef: ChangeDetectorRef) {

    window.addEventListener('keydown', event => {
      console.info('key', event.key);
      if (event.key === Keys.Control && !this._isCtrlPressed) {
        this._isCtrlPressed = true;
        this.changeDetectorRef.detectChanges();
        console.debug(`Drag enabled, isDragDisabled:${this.isDragDisabled}`);
        return;
      }

      if (this._isCtrlPressed) {
        this.move(event.key as Keys);
      }
    });

    window.addEventListener('keyup', event => {
      if (event.key === Keys.Control && this._isCtrlPressed) {
        this._isCtrlPressed = false;
        this.changeDetectorRef.detectChanges();
        console.debug(`Drag disabled, isDragDisabled:${this.isDragDisabled}`);
      }
    });
  }

  private move(key: Keys): void {
    if (!this._selectedPostIt) {
      return;
    }

    const gap = 10;
    switch (key) {
      case Keys.ArrowDown:
        this._selectedPostIt.position =
        {
          x: this._selectedPostIt.position.x,
          y: this._selectedPostIt.position.y + gap
        };
        break;

      case Keys.ArrowUp:
        if (this._selectedPostIt.position.y <= 0) {
          return;
        }
        this._selectedPostIt.position =
        {
          x: this._selectedPostIt.position.x,
          y: this._selectedPostIt.position.y - gap
        };
        break;

      case Keys.ArrowRight:
        this._selectedPostIt.position =
        {
          x: this._selectedPostIt.position.x + gap,
          y: this._selectedPostIt.position.y
        };
        break;

      case Keys.ArrowLeft:
        if (this._selectedPostIt.position.x <= 0) {
          return;
        }
        this._selectedPostIt.position =
        {
          x: this._selectedPostIt.position.x - gap,
          y: this._selectedPostIt.position.y
        };
        break;
    }

    this.changeDetectorRef.detectChanges();
    this._postItService.savePostItAsync(this._selectedPostIt.postIt);
  }

  public async ngOnInit(): Promise<void> {
    const postIts = await this._postItService.getPostItsAsync();
    this._postIts = [];
    this._postIts.push(...postIts.map(p => new PostItViewModel(this._postItService, p, this._postIts)));
    this.changeDetectorRef.detectChanges();
  }

  public get isDragDisabled(): boolean {
    return !this._isCtrlPressed;
  }

  public get postIts(): PostItViewModel[] {
    return this._postIts;
  }

  public select(postIt: PostItViewModel): void {
    this._selectedPostIt = postIt;
    postIt.selectAsync();
  }

  public isSelected(postIt: PostItViewModel): boolean {
    return postIt === this._selectedPostIt;
  }

  public async delete(postIt: PostItViewModel): Promise<void> {
    await this._postItService.deletePostItAsync(postIt.postIt);
    this._postIts = ArrayService.removeItem(this._postIts, (item: PostItViewModel) => item.id === postIt.id);
  }

  public async add(): Promise<void> {
    const postIt = PostIt.create(this._postIts.map(p => p.postIt));
    const postItViewModel = new PostItViewModel(this._postItService, postIt, this.postIts);

    this._postIts.push(postItViewModel);
    await this._postItService.savePostItAsync(postIt);
  }

  public openColorDialog(postIt: PostItViewModel): void {
    const dialogRef = this._dialog.open(PopupPostItColorDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        postIt.color = result;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  public drop(event: CdkDragEnd, postItVM: PostItViewModel) {
    postItVM.position = event.source.getFreeDragPosition()
    this._postItService.savePostItAsync(postItVM.postIt);
  }
}   
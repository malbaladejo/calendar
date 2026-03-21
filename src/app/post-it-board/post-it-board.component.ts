import { Component, Inject, OnInit } from '@angular/core';
import { IPostItService, POST_IT_SERVICE } from '../services/post-it/post-it.interface.service';
import { PostIt } from '../services/post-it/post-it';
import { ArrayService } from '../services/array-service';
import { MatDialog } from '@angular/material/dialog';
import { PopupPostItColorDialogComponent } from './popup-post-it-color-dialog.component';
import { PostItViewModel } from './post-it.viewmodel';

@Component({
  selector: 'app-post-it-board',
  templateUrl: './post-it-board.component.html',
  styleUrls: ['./post-it-board.component.scss'],
  standalone: false
})
export class PostItBoardComponent implements OnInit {
  private _postIts: Array<PostItViewModel> = [];
  private _selectedPostIt?: PostItViewModel;

  constructor(
    @Inject(POST_IT_SERVICE) private _postItService: IPostItService,
    private _dialog: MatDialog) {

  }

  public async ngOnInit(): Promise<void> {
    const postIts = await this._postItService.getPostItsAsync();
    this._postIts = postIts.map(p => new PostItViewModel(this._postItService, p));
  }

  public get postIts(): PostItViewModel[] {
    return this._postIts;
  }

  public select(postIt: PostItViewModel): void {
    this._selectedPostIt = postIt;
  }

  public isSelected(postIt: PostItViewModel): boolean {
    return postIt === this._selectedPostIt;
  }

  public async delete(postIt: PostIt): Promise<void> {
    await this._postItService.deletePostItAsync(postIt);
    this._postIts = ArrayService.removeItem(this._postIts, (item: PostItViewModel) => item.id === postIt.id);
  }

  public async add(): Promise<void> {
    const postIt = new PostIt();
    const postItViewModel = new PostItViewModel(this._postItService, postIt);

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
        await this._postItService.savePostItAsync(postIt.postIt);
      }
    });
  }
}   
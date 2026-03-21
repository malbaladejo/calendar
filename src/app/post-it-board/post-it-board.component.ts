import { Component, Inject, OnInit } from '@angular/core';
import { IPostItService, POST_IT_SERVICE } from '../services/post-it/post-it.interface.service';
import { PostIt } from '../services/post-it/post-it';
import { ArrayService } from '../services/array-service';

@Component({
  selector: 'app-post-it-board',
  templateUrl: './post-it-board.component.html',
  styleUrls: ['./post-it-board.component.scss'],
  standalone: false
})
export class PostItBoardComponent implements OnInit {
  private _postIts: Array<PostIt> = [];
  private _selectedPostIt?: PostIt;

  constructor(@Inject(POST_IT_SERVICE) private _postItService: IPostItService) {

  }

  public async ngOnInit(): Promise<void> {
    this._postIts = await this._postItService.getPostItsAsync();
  }

  public get postIts(): PostIt[] {
    return this._postIts;
  }

  public select(postIt: PostIt): void {
    this._selectedPostIt = postIt;
  }

  public isSelected(postIt: PostIt): boolean {
    return postIt === this._selectedPostIt;
  }

  public async delete(postIt: PostIt): Promise<void> {
    await this._postItService.deletePostItAsync(postIt);
    this._postIts = ArrayService.removeItem(this._postIts, (item: PostIt) => item.id === postIt.id);
  }

  public async add(): Promise<void> {
    const postIt = new PostIt();

    this._postIts.push(postIt);
    await this._postItService.savePostItAsync(postIt);
  }
}   
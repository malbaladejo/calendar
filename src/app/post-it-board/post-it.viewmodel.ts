import { PostIt } from '../services/post-it/post-it';
import { PostItColor } from '../services/post-it/post-it-color';
import { IPostItService } from '../services/post-it/post-it.interface.service';

export class PostItViewModel {

    constructor(private _postItService: IPostItService, public readonly postIt: PostIt) {

    }

    public get id(): string {
        return this.postIt.id;
    }

    public get text(): string | undefined {
        return this.postIt.text;
    }

    public set text(value: string | undefined) {
        this.postIt.text = value;
        this._postItService.savePostItAsync(this.postIt);

    }

    public get color(): PostItColor | undefined {
        return this.postIt.color;
    }

    public set color(value: PostItColor | undefined) {
        this.postIt.color = value;
        this._postItService.savePostItAsync(this.postIt);

    }
}
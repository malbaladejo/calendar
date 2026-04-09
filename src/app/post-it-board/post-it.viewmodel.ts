import { Point } from '@angular/cdk/drag-drop';
import { PostIt } from '../services/post-it/post-it';
import { PostItColor } from '../services/post-it/post-it-color';
import { IPostItService } from '../services/post-it/post-it.interface.service';

export class PostItViewModel {

    constructor(
        private _postItService: IPostItService,
        public readonly postIt: PostIt,
        private readonly postIts: PostItViewModel[]) {

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

    public get color(): PostItColor {
        return this.postIt.color;
    }

    public set color(value: PostItColor) {
        this.postIt.color = value;
        this._postItService.savePostItAsync(this.postIt);
    }

    public get zIndex(): number {
        return this.postIt.zIndex;
    }

    public get position(): Readonly<Point> {
        return this.postIt.position;
    }

    public set position(value: Readonly<Point>) {
        this.postIt.position = value;
    }

    public async selectAsync(): Promise<void> {
        this.postIt.zIndex = Math.max(...this.postIts.map(p => p.postIt.zIndex)) + 1;
        await this._postItService.savePostItAsync(this.postIt);
    }
}
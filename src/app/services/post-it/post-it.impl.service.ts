import { Injectable } from "@angular/core";
import { IPostItService } from './post-it.interface.service';
import { PostIt } from './post-it';
import { ArrayService } from '../array-service';

@Injectable()
export class PostItService implements IPostItService {
    private readonly _postitKey = 'postits';

    public async getPostItsAsync(): Promise<PostIt[]> {
        await this.cleanZIndexAsync();
        await this.cleanPositionAsync();
        let postIts = this.getPostItsFromLocalStorage();
        return Promise.resolve(postIts);
    }

    public async savePostItAsync(postIt: PostIt): Promise<void> {
        if (postIt.isDeleted === true) {
            return;
        }

        let postIts = this.getPostItsFromLocalStorage();

        let postItData = postIts.find(p => p.id === postIt.id);
        if (!postItData) {
            postIts.push(postIt);
        } else {
            postIt.copyTo(postItData);
        }

        this.savePostItsToLocalStorage(postIts);
    }

    public async deletePostItAsync(postIt: PostIt): Promise<void> {
        postIt.isDeleted = true;
        let postIts = this.getPostItsFromLocalStorage();

        postIts = ArrayService.removeItem(postIts, p => p.id === postIt.id);
        this.savePostItsToLocalStorage(postIts);
    }

    private async cleanZIndexAsync(): Promise<void> {
        const postIts = this.getPostItsFromLocalStorage();
        postIts.sort((a, b) => a.zIndex - b.zIndex);

        for (let i = 0; i < postIts.length; i++) {
            postIts[i].zIndex = i;
            await this.savePostItAsync(postIts[i]);
        }
    }

    private async cleanPositionAsync(): Promise<void> {
        const postIts = this.getPostItsFromLocalStorage();
       const legacyPostits =  postIts.filter(p=> !p.position);

        for (let i = 0; i < legacyPostits.length; i++) {
            postIts[i].position = PostIt.getPosition(postIts);
            await this.savePostItAsync(postIts[i]);
        }
    }

    private savePostItsToLocalStorage(postIts: PostIt[]): void {
        localStorage.setItem(this._postitKey, JSON.stringify(postIts));
    }

    private getPostItsFromLocalStorage(): PostIt[] {
        const jsonPostits = localStorage.getItem(this._postitKey);
        let postits: Array<PostIt> = [];

        if (jsonPostits) {
            postits = JSON.parse(jsonPostits) as PostIt[];
            if (!postits) {
                postits = [];
            }
        }

        postits = postits.map(p => PostIt.createFromDto(p));

        return postits;
    }
}
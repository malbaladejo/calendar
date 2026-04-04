import { Injectable } from "@angular/core";
import { IPostItService } from './post-it.interface.service';
import { PostIt } from './post-it';
import { PostItColor } from './post-it-color';
import { json } from '@angular-devkit/core';
import { ArrayService } from '../array-service';

@Injectable()
export class PostItService implements IPostItService {
    private readonly _postitKey = 'postits';

    public getPostItsAsync(): Promise<PostIt[]> {
        const jsonPostits = localStorage.getItem(this._postitKey);
        let postits: Array<PostIt> = [];

        if (jsonPostits) {
            postits = JSON.parse(jsonPostits) as PostIt[];
            if (!postits) {
                postits = [];
            }
        }

        return Promise.resolve(postits);
    }

    public async savePostItAsync(postIt: PostIt): Promise<void> {
        let postIts = await this.getPostItsAsync();

        let postItData = postIts.find(p => p.id === postIt.id);
        if (!postItData) {
            postIts.push(postIt);
        } else {
            postItData.color = postIt.color;
            postItData.text = postIt.text;
        }

        localStorage.setItem(this._postitKey, JSON.stringify(postIts));
    }

    public async deletePostItAsync(postIt: PostIt): Promise<void> {
        let postIts = await this.getPostItsAsync();

        postIts = ArrayService.removeItem(postIts, p => p.id === postIt.id);
        localStorage.setItem(this._postitKey, JSON.stringify(postIts));
    }
}
import { InjectionToken } from '@angular/core';
import { PostIt } from './post-it';

export const POST_IT_SERVICE = new InjectionToken<IPostItService>('POST_IT_SERVICE')

export interface IPostItService {
    getPostItsAsync(): Promise<PostIt[]>;

    savePostItAsync(postIt: PostIt): Promise<void>;

    deletePostItAsync(postIt: PostIt): Promise<void>;
}
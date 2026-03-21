import { Injectable } from "@angular/core";
import { IPostItService } from './post-it.interface.service';
import { PostIt } from './post-it';
import { PostItColor } from './post-it-color';

@Injectable()
export class PostItMockService implements IPostItService {
    getPostItsAsync(): Promise<PostIt[]> {
        return Promise.resolve([
            new PostIt('a faire', PostItColor.red),
            new PostIt('a faire', PostItColor.pink),
            new PostIt('a faire', PostItColor.orange),
            new PostIt('a faire', PostItColor.yellow),
            new PostIt('a faire', PostItColor.green),
            new PostIt('a faire', PostItColor.blue),
            new PostIt('a faire', PostItColor.darkblue),
            new PostIt('a faire', PostItColor.turquoise),
            new PostIt('a faire', PostItColor.purple),
        ]);
    }

    savePostItAsync(postIt: PostIt): Promise<void> {

        return Promise.resolve();
    }

    deletePostItAsync(postIt: PostIt): Promise<void> {
        return Promise.resolve();
    }

}
import { Point } from '@angular/cdk/drag-drop';
import { UidService } from '../uid.service';
import { PostItColor } from './post-it-color';
import { M } from '@angular/cdk/keycodes';

export class PostIt {
    public id: string;
    public position = { x: 0, y: 0 };
    public zIndex = 0;
    public text?: string;
    public color = PostItColor.yellow;
    public isDeleted: boolean | undefined;

    constructor() {
        this.id = UidService.getUid();
    }

    public copyTo(target: PostIt): void {
        target.color = this.color;
        target.position = this.position;
        target.text = this.text;
        target.zIndex = this.zIndex;
    }

    public static createFromDto(source: PostIt): PostIt {
        const target = new PostIt();
        target.id = source.id;
        target.text = source.text;
        target.position = source.position;
        target.zIndex = source.zIndex;
        target.color = source.color;

        return target;
    }

    public static create(postIts: PostIt[]): PostIt {
        const color = Object.values(PostItColor)[
            Math.floor(Math.random() * Object.values(PostItColor).length)];

        const postIt = new PostIt();
        postIt.color = color;
        postIt.position = PostIt.getPosition(postIts);
        postIt.zIndex = Math.max(...postIts.map(p => p.zIndex));
        return postIt;
    }

    public static getPosition(postIts: PostIt[]): Point {
        const gap = 50;

        let xIndex = 0;
        let numberOfPostIts = 0;
        let x = gap;
        let y = gap;
        while (true) {
            let postIt = postIts.find(p => p.position?.x === x && p.position?.y === y);
            if (!postIt) {
                return { x, y };
            }
            if (numberOfPostIts === 10) {
                numberOfPostIts = 0;
                xIndex++;
                x = gap * xIndex + gap / 2;
                y = gap;
            }
            else {
                x += gap;
                y += gap;
            }
            numberOfPostIts++;

            console.log(`x:${x}, y:${y}, numberOfPostIts:${numberOfPostIts}, xIndex:${xIndex}`);
        }
    }
}
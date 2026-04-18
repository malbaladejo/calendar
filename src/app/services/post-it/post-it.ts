import { Point } from '@angular/cdk/drag-drop';
import { UidService } from '../uid.service';
import { PostItColor } from './post-it-color';

export class PostIt {
    public id: string;
    public position: Readonly<Point>;

    constructor(
        public text?: string,
        public color?: PostItColor) {
        this.id = UidService.getUid();
        this.position = { x: 0, y: 0 };

        if (!this.color) {
            this.color = PostItColor.yellow;
        }
    }

    public static create(postIts: PostIt[]): PostIt {
        const color = Object.values(PostItColor)[
            Math.floor(Math.random() * Object.values(PostItColor).length)];

        const postIt = new PostIt('', color);
        postIt.position = PostIt.getPosition(postIts);
        return postIt;
    }

    private static getPosition(postIts: PostIt[]): Point {
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
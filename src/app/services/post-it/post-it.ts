import { UidService } from '../uid.service';
import { PostItColor } from './post-it-color';

export class PostIt {
    public id: string;

    constructor(
        public text?: string,
        public color?: PostItColor) {
        this.id = UidService.getUid();
       
        if (!this.color) {
            this.color = PostItColor.yellow;
        }
    }
}
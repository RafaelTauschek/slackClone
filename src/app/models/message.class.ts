import { Emoji } from "./emoji.class";

export class Message {
    senderId: string;
    recieverId: string;
    timestamp: number;
    content: string;
    emojis: Emoji[];
    answers: any[];


    constructor(obj: any) {
        this.senderId = obj ? obj.senderId : '';
        this.recieverId = obj ? obj.recieverId : '';
        this.timestamp = obj ? obj.timestamp : 0;
        this.content = obj ? obj.content : '';
        this.emojis = obj ? obj.emojis : [];
        this.answers = obj ? obj.answers : [];
    }

    public toJSON () {
        return {
            senderId: this.senderId,
            recieverId: this.recieverId,
            timestamp: this.timestamp,
            content: this.content,
            emojis: this.emojis,
            answers: this.answers,
        }
    }
}
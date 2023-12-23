export class Emoji {
    sender: string;
    emoji: string;

    constructor(obj: any) {
        this.sender = obj ? obj.sender : '';
        this.emoji = obj ? obj.emoji : '';
    }


    public toJSON() {
        return {
            sender: this.sender,
            emoji: this.emoji,
        }
    }
}
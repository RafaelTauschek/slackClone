import { Message } from "./message.class";

export class Channel {
    name: string;
    description: string;
    creator: string;
    id: string;
    messages: Message[];


    constructor(obj: any) {
        this.name = obj ? obj.name : '';
        this.description = obj ? obj.description : '';
        this.creator = obj ? obj.creator : '';
        this.id = obj ? obj.id : '';
        this.messages = obj ? obj.messages : [];
    }


    public toJSON() {
        return {
            name: this.name,
            description: this.description,
            creator: this.creator,
            id: this.id,
            messages: this.messages,
        }
    }
}
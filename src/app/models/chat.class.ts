import { Message } from "./message.class";

export class Chat {
    id: string;
    messages: Message[];
    users: string[];


    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.messages = obj ? obj.messages : [];
        this.users = obj ? obj.users : [];
    }

    public toJSON() {
        return {
            id: this.id,
            messages: this.messages,
            users: this.users,
        }
    }
}
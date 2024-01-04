import { Message } from "./message.class";

export class Chat {
    chatId: string;
    messages: Message[];
    users: string[];


    constructor(obj?: any) {
        this.chatId = obj ? obj.chatId : '';
        this.messages = obj ? obj.messages : [];
        this.users = obj ? obj.users : [];
    }

    public toJSON() {
        return {
            chatId: this.chatId,
            messages: this.messages,
            users: this.users,
        }
    }
}
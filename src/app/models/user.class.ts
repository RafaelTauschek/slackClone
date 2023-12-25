export class User {
    name: string;
    email: string;
    profilepicture: string;
    id: string;
    channels: string[];
    chats: string[];


    constructor(obj?: any) {
        this.name = obj ? obj.name : '';
        this.email = obj ? obj.email : '';
        this.profilepicture = obj ? obj.profilepicture : '';
        this.id = obj ? obj.id : '';
        this.channels = obj ? obj.channels : [];
        this.chats = obj ? obj.chats : [];
    }

    public toJSON() {
        return {
            name: this.name,
            email: this.email,
            profilepicture: this.profilepicture,
            id: this.id,
            channels: this.channels || [],
            chats: this.chats || [],
        }
    }
}
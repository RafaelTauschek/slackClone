export class Emoji {
    senders: string[];
    emoji: string;
    count: number;
  
    constructor(obj: any) {
      this.senders = obj && obj.senders ? obj.senders : [];
      this.emoji = obj ? obj.emoji : '';
      this.count = obj && obj.count ? obj.count : 0;
    }
  
    public toJSON() {
      return {
        senders: this.senders,
        emoji: this.emoji,
        count: this.count,
      }
    }
  }
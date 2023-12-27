import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ChatAreaComponent } from '../chat-area/chat-area.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { Subscription } from 'rxjs';
import { Channel } from '../../../models/channel.class';
import { ChannelService } from '../../../services/channel.service';
import { FormsModule } from '@angular/forms';
import { Message } from '../../../models/message.class';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.class';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [CommonModule, ChatAreaComponent, RouterOutlet, RouterModule, PickerComponent, FormsModule],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent implements OnDestroy {
  channelSubscription: Subscription;
  channel: Channel[] = [];
  message: string = '';

  constructor(public channelService: ChannelService, private userService: UserService, private messageService: MessageService) {
    this.channelSubscription = this.channelService.channelSubscription$.subscribe((channel) => {
      this.channel = channel;
    });
  }


  async sendMessage() {
    if (this.message !== '') {
      this.messageService.sendChannelMessage(this.message);
      this.message = '';
    }
  }

  addEmoji(event: Event) {
    console.log('Event activated: ', event);
  }

  ngOnDestroy(): void {
    this.channelSubscription.unsubscribe();
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ChatAreaComponent } from '../../chats/chat-area/chat-area.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { Subscription } from 'rxjs';
import { Channel } from '../../../models/channel.class';
import { ChannelService } from '../../../services/channel.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { MessageService } from '../../../services/message.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditChannelDialogComponent } from '../../dialogs/edit-channel-dialog/edit-channel-dialog.component';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [CommonModule, ChatAreaComponent, RouterOutlet, RouterModule, PickerComponent, FormsModule, MatDialogModule],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent implements OnDestroy {
  channelSubscription: Subscription;
  channel: Channel[] = [];
  message: string = '';

  constructor(public channelService: ChannelService, private userService: UserService, private messageService: MessageService, private dialog: MatDialog ) {
    this.channelSubscription = this.channelService.channelSubscription$.subscribe((channel) => {
      this.channel = channel;
    });
  }


  openDialog() {
    this.dialog.open(EditChannelDialogComponent, {});
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

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
  memberInviteActive: boolean = false;
  memberListActive: boolean = false;
  selectedFileName: string = '';
  selectedFile: File | null = null;

  constructor(public channelService: ChannelService, private userService: UserService, private messageService: MessageService, private dialog: MatDialog ) {
    this.channelSubscription = this.channelService.channelSubscription$.subscribe((channel) => {
      this.channel = channel;
    });
  }

  openMemberList() {
    this.memberListActive = true;
  }

  openInviteList() {
    this.memberListActive = false;
    this.memberInviteActive = true;
  }


  closeMenus() {
    this.memberInviteActive = false;
    this.memberListActive = false;  
  }

  openDialog() {
    this.dialog.open(EditChannelDialogComponent, {});
  }



  addEmoji(event: Event) {
    console.log('Event activated: ', event);
  }

  ngOnDestroy(): void {
    this.channelSubscription.unsubscribe();
  }



  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.selectedFile?.name ?? '';
    }
  }

  async sendMessage() {
    if (this.message !== '' || this.selectedFile) {
      this.messageService.sendChannelMessage(this.message, this.selectedFile);
    } 
  }

  // async sendMessage() {
  //   if (this.message !== '') {
  //     if (this.selectedFileName) {
  //       this.messageService.sendChannelMessage(this.message, this.selectedFile);
  //     } 
      
  //     this.message = '';
  //   }
  // }


  // async sendMessage() {
  //   if (this.selectedFile) {
  //     const fileUrl = await this.uploadFile(this.selectedFile);
  //     this.message = new Message({
  //       // ...
  //       content: this.messageText,
  //       fileName: this.selectedFileName,
  //       fileUrl: fileUrl,
  //     });
  //   } else {
  //     this.message = new Message({
  //       // ...
  //       content: this.messageText,
  //     });
  //   }
  //   // Send the message...
  //   this.messageText = '';
  //   this.selectedFile = null;
  //}
}

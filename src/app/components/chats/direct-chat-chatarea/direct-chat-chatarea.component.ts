import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/shared.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserDataService } from '../../../services/data.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-direct-chat-chatarea',
  standalone: true,
  imports: [CommonModule, PickerComponent, EmojiModule, FormsModule],
  templateUrl: './direct-chat-chatarea.component.html',
  styleUrl: './direct-chat-chatarea.component.scss'
})
export class DirectChatChatareaComponent {
  editMenu: boolean = false;
  edit: boolean = false;
  messageContent: string = '';

  constructor (public sharedService: SharedService, public sanitizer: DomSanitizer, public data: UserDataService) {}

  toggleEditMenu(message: any) {
      this.editMenu = !this.editMenu;
      message.editMessage = true;
  }

  addEmoji(event: any) {

  }

  editMessage(message: any) {
    this.messageContent = message.content;
    this.editMenu = !this.editMenu;
    this.edit = !this.edit;
  }

  cancelEditing(message: any) {
    this.edit = false;
    this.editMenu = false;
    message.editMessage = false;
  }

  saveChanges(message: any) {
    this.edit = false;
    this.editMenu = false;
    message.editMessage = false;
    this.data.editChatMessage(message, this.messageContent);
  }

}

import { Component } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../../services/data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-thread-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './thread-chat.component.html',
  styleUrl: './thread-chat.component.scss'
})
export class ThreadChatComponent {
  editMenu: boolean = false;
  edit: boolean = false;
  messageContent: string = '';

  constructor(public sharedService: SharedService, public data: UserDataService) {
    
  }

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
  this.data.editThreadMessage(this.data.message, message, this.messageContent);
}


}

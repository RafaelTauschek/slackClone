import { Component } from '@angular/core';
import { AvatarService } from '../../../services/avatar.service';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss'
})
export class SelectAvatarComponent {
  selectedAvatar!: File;


  constructor(private avatarService: AvatarService, private userService: UserService, private route: ActivatedRoute) {

  }


  onFileSelected(event: any): void {
    this.selectedAvatar = event.target.files[0];
  }

  uploadAvatar() {
    if (this.selectedAvatar) {

    }
  }



}

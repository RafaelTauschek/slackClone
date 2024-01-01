import { Component } from '@angular/core';
import { AvatarService } from '../../../services/avatar.service';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss'
})
export class SelectAvatarComponent {
  avatarId = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6'];
  uploadedAvatar!: File;
  selectedAvatar!: string;


  username: string = '';
  useremail: string = '';
  userId: string = '';

  constructor(private avatarService: AvatarService, private userService: UserService,
    private route: ActivatedRoute, private firebaseService: FirebaseService, private router: Router) {
    this.route.paramMap.subscribe((paramMap) => {
      const name = paramMap.get('name') || '';
      this.username = name.toString();
      const email = paramMap.get('email') || '';
      this.useremail = email;
      const id = paramMap.get('docId') || '';
      this.userId = id;
    })
  }

  setSelectedAvatar(avatar: string) {
    this.selectedAvatar = avatar;
    console.log('Selected Avatar', avatar);
  }

  async submitSelectedAvatar() {
    if (this.selectedAvatar) {
      const userData = {
        name: this.username,
        email: this.useremail,
        id: this.userId,
        profilepicture: this.selectedAvatar,
        chats: [],
        channels: []
      }
      console.log(this.userId, userData);
      
      await this.firebaseService.updateDocument('users', this.userId, userData);
      setTimeout(() => {
        this.router.navigate(['/main']);
      }, 500)
    } else {
      console.log('You did not select an avatar');

    }
  }


  onFileSelected(event: any): void {
    this.uploadedAvatar = event.target.files[0];
  }

  uploadAvatar() {
    if (this.uploadedAvatar) {

    }
  }



}

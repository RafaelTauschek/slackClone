import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../../services/firebase.service';
import { StorageService } from '../../../services/storage.service';

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
  disabled: boolean = true;
  username: string = '';
  useremail: string = '';
  userId: string = '';

  constructor(private userService: UserService,
    private route: ActivatedRoute, private firebaseService: FirebaseService, private router: Router, private storageService: StorageService) {
    console.log(this.selectedAvatar);

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
    this.selectedAvatar = `./assets/img/avatars/${avatar}.png`;
    this.uploadedAvatar = null as any;
    this.disabled = false;

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
    if (this.selectedAvatar && this.uploadedAvatar) {
      URL.revokeObjectURL(this.selectedAvatar);
    }

    this.uploadedAvatar = event.target.files[0];
    this.selectedAvatar = URL.createObjectURL(this.uploadedAvatar);
    const reader = new FileReader();

    reader.onload = () => {
      this.selectedAvatar = reader.result as string;
      console.log(this.selectedAvatar);
      this.disabled = false;
    };

    reader.readAsDataURL(this.uploadedAvatar);
  }

  async uploadAvatar() {
    if (this.uploadedAvatar) {
      const url = await this.storageService.uploadFile(this.uploadedAvatar);
      this.selectedAvatar = url;
      this.disabled = false;
    }
  }



}

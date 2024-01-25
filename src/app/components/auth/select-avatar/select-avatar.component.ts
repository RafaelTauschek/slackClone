import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../../services/firebase.service';
import { User } from '../../../models/user.class';
import { UserDataService } from '../../../services/data.service';

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
  popupActive: boolean = false;

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService, private router: Router, private data: UserDataService) {
    this.route.paramMap.subscribe((paramMap) => {
      const name = paramMap.get('name') || '';
      this.username = name.toString();
      const email = paramMap.get('email') || '';
      this.useremail = email;
      const id = paramMap.get('docId') || '';
      this.userId = id;
    });
  }

  setSelectedAvatar(avatar: string) {
    this.selectedAvatar = avatar;
    this.uploadedAvatar = null as any;
    this.disabled = false;
  }



  async submitSelectedAvatar() {
    let profilePictureUrl = this.selectedAvatar;
    if (this.uploadedAvatar) {
      profilePictureUrl = await this.firebaseService.uploadFile(this.uploadedAvatar);
    }
    if (profilePictureUrl) {
      const user =  new User ({
        name: this.username,
        email: this.useremail,
        id: this.userId,
        profilepicture: profilePictureUrl,
        chats: [],
        channels: ['EowDB4sgj49a8UmrbmBj']
      });
      this.popupActive = true;
      await this.firebaseService.updateDocument('users', this.userId, user.toJSON());
      await this.data.generateFirstChat(this.userId);
      await this.firebaseService.updateCollection('channels', 'EowDB4sgj49a8UmrbmBj' , 'users', this.userId);
      setTimeout(() => {
        this.router.navigate(['/login']).then(() => {
          this.popupActive = false;
        });
      }, 1500);
    } else {
      console.warn('No avatar selected');
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
      this.disabled = false;
    };
    reader.readAsDataURL(this.uploadedAvatar);
  }
}

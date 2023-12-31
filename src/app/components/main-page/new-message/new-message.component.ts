import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ChannelService } from '../../../services/channel.service';
import { Channel } from '../../../models/channel.class';
import { User } from '../../../models/user.class';  
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent implements OnDestroy {
  users: User[] = [];
  channels: Channel[] = [];
  usersSubscription: Subscription;  
  channelsSubscription: Subscription; 




  constructor(private userService: UserService, private channelService: ChannelService) {
    this.usersSubscription = this.userService.usersObservable$.subscribe((users) => {
      this.users = users;
      console.log('Available Users: ', users);
    });
    this.channelsSubscription = this.channelService.channelsSubscription$.subscribe((channels) => {
      this.channels = channels;
      console.log('Available Channels: ', channels);
    }); 
  }


  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
    this.channelsSubscription.unsubscribe();  
  }

  sendMessage() {}
}

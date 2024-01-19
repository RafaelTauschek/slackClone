import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { ChannelChatComponent } from '../channel-chat/channel-chat.component';
import { DirectChatComponent } from '../direct-chat/direct-chat.component';
import { ThreadComponent } from '../thread/thread.component';
import { NewMessageComponent } from '../new-message/new-message.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, ChannelChatComponent, DirectChatComponent, RouterOutlet, RouterModule, ThreadComponent, NewMessageComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
  isSidebarOpen: boolean = true;

  constructor(public sharedService: SharedService) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIfMobile();
    this.checkIfTablet();
  }

  ngOnInit(): void {
    this.checkIfMobile();
    this.checkIfTablet();
  }

  checkIfMobile() {
    this.sharedService.isMobile = window.matchMedia('(max-width: 1024px)').matches;
  }

  checkIfTablet() {
    this.sharedService.isTablet = window.matchMedia('(min-width: 1025px) and (max-width: 1280px)').matches;
  }

  

}

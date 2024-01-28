
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { LoginComponent } from '../../auth/login/login.component';
import { RouterOutlet } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
@Component({
  selector: 'app-intro-screen',
  standalone: true,
  imports: [CommonModule, LoginComponent, RouterOutlet, RouterModule,],
  templateUrl: './intro-screen.component.html',
  styleUrl: './intro-screen.component.scss',
})
export class IntroScreenComponent implements AfterViewInit, OnInit {


  constructor(public route: ActivatedRoute, public router: Router) { }
  animationStart: boolean = false;
  animationEnd: boolean = false;
  logoAnimationStart: boolean = false;
  textAnimationStart: boolean = false;
  dNone: boolean = true;
  startFadingOut: boolean = false;
  isMobile: boolean = false;

  ngOnInit() {
    if (window.innerWidth < 1024) {
      this.isMobile = true;
    }
  }
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.playAnimation();
    }, 0);
  }

  playAnimation() {
    this.animationStart = true;
    setTimeout(() => {
      this.logoAnimationStart = true;
      setTimeout(() => {
        this.dNone = false;
        this.textAnimationStart = true;
        setTimeout(() => {
          this.animationEnd = true;
          setTimeout(() => {
            this.startFadingOut = true;
          }, 2300); // Starte fading out animation
          setTimeout(() => {
            this.animationEnd = false;
            this.animationStart = false;
          }, 3000); // Wait for moveAndScaleDown animation to finish
        }, 2000); // Wait for moveTextToRight animation to finish
      }, 1000); // Start moveTextToRight animation immediately after moveLogoLeft animation
    }, 0); // Initial delay
  }
}
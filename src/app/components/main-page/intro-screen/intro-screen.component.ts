
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { LoginComponent } from '../../auth/login/login.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-intro-screen',
  standalone: true,
  imports: [CommonModule, LoginComponent, RouterOutlet, RouterModule],
  templateUrl: './intro-screen.component.html',
  styleUrl: './intro-screen.component.scss',
})
export class IntroScreenComponent implements OnInit {

  animationEnd: boolean = false;


  constructor(public route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.animationEnd = true;
    }, 2000)
  }
}


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule, LoginComponent, RouterOutlet, RouterModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent implements OnInit {

  animationEnd: boolean = false;


  constructor(public route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.animationEnd = true;
    }, 2000)
  }
}

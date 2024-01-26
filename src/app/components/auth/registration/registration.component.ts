import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterModule, RouterLink, FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  checkboxChecked: boolean = false;


  constructor(private authService: AuthService) {}

  async register() {
    if (this.name !== '' && this.email !== '' && this.password !== '' && this.checkboxChecked) {
      await this.authService.registerUser(this.email, this.password, this.name);
    } else {
      console.warn('Form was not filled correctly');
    }
  }

  checkboxEvent() {
    this.checkboxChecked = !this.checkboxChecked;
  }
}

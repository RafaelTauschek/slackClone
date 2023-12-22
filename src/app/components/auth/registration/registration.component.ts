import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [RouterModule, RouterLink, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  name: string = '';
  email: string = '';
  password: string = '';


  constructor(private authService: AuthService) {}

  async register() {
    if (this.name !== '' && this.email !== '' && this.password !== '') {
      console.log('Form was filled correctly');
      await this.authService.registerUser(this.email, this.password, this.name);
    } else {
      console.log('you fucked up!');
    }
  }
}

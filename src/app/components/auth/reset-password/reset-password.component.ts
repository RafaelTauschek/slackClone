import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink, RouterModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {


  resetPassword() {}
}

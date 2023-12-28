import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-select-password',
  standalone: true,
  imports: [RouterModule, RouterLink, FormsModule, CommonModule],
  templateUrl: './select-password.component.html',
  styleUrl: './select-password.component.scss'
})
export class SelectPasswordComponent {
  password: string = '';
  repeatPassword: string = '';

  changePassword() {}
}

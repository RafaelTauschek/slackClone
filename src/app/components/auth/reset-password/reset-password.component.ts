import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink, RouterModule, ReactiveFormsModule ,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  myForm: FormGroup;

  constructor(private authService: AuthService, private formbuilder: FormBuilder) {
    this.myForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  resetPassword() {
    if (this.myForm.valid ) {
      const email = this.myForm.get('email')?.value;
      if (email) {
        console.log('email is valid');
        this.authService.resetPassword(email);
      } else {
        console.log('email is invalid');
      }
    }
  }
}

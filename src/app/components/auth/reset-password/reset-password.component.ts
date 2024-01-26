import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink, RouterModule, ReactiveFormsModule ,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  myForm: FormGroup;
  popupActive: boolean = false;

  constructor(private authService: AuthService, private formbuilder: FormBuilder, private router: Router) {
    this.myForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  resetPassword() {
    if (this.myForm.valid ) {
      const email = this.myForm.get('email')?.value;
      if (email) {
        this.authService.resetPassword(email);
        this.popupActive = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
          this.popupActive = false;
        }, 1500);
      } else {
        console.warn('email is invalid');
      }
    }
  }
}

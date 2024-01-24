
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-select-password',
  standalone: true,
  imports: [RouterModule, RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './select-password.component.html',
  styleUrl: './select-password.component.scss'
})
export class SelectPasswordComponent {
  changePasswordForm: FormGroup;
  isSubmitted: boolean = false;
  code: string | null = null;
  popupActive: boolean = false;

  constructor(private formbuilder: FormBuilder, private route: ActivatedRoute, private authService: AuthService, private router: Router) {
    this.changePasswordForm = this.formbuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(8)]]
    })
    this.code = this.route.snapshot.queryParams['oobCode'];
    console.log(this.code);
  }

  changePassword() {
    this.isSubmitted = true;
    if (this.changePasswordForm.valid && this.changePasswordForm.get('password')?.value === this.changePasswordForm.get('repeatPassword')?.value) {
      const password = this.changePasswordForm.get('password')?.value;
      if (password) {
        console.log('password is valid');
        this.authService.changePassword(password, this.code);
        this.popupActive = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
          this.popupActive = false;
        }, 1500);
      } else {
        console.log('password is invalid');
      }
    } else {
      console.log('passwords do not match');
    }
    this.isSubmitted = false;
  }



}

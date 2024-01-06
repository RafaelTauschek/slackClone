import { Routes } from '@angular/router';
import { IntroScreenComponent } from './components/main-page/intro-screen/intro-screen.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import { SelectAvatarComponent } from './components/auth/select-avatar/select-avatar.component';
import { SelectPasswordComponent } from './components/auth/select-password/select-password.component';
import { MainPageComponent } from './components/main-page/main-page/main-page.component';

export const routes: Routes = [
    {path: '', component: IntroScreenComponent, children: [
        {path: '', redirectTo: 'login', pathMatch: 'full'},
        {path: 'login', component: LoginComponent},
        {path: 'registration', component: RegistrationComponent},
        {path: 'reset-password', component: ResetPasswordComponent},
        {path: 'select-password', component: SelectPasswordComponent},
        {path: 'select-avatar', component: SelectAvatarComponent}
    ]},
    {path: 'main', component: MainPageComponent}
];

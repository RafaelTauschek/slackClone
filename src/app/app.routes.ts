import { Routes } from '@angular/router';
import { StartScreenComponent } from './components/start-screen/start-screen.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SelectAvatarComponent } from './components/select-avatar/select-avatar.component';
import { SelectPasswordComponent } from './components/select-password/select-password.component';

export const routes: Routes = [
    {path: '', component: StartScreenComponent, children: [
        {path: '', redirectTo: 'login', pathMatch: 'full'},
        {path: 'login', component: LoginComponent}

    ]}
];

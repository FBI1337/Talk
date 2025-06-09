import { Routes } from '@angular/router';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { LayoutComponent } from './common-ui/layout/layout.component';
import { canActivateAuth, canActivateRole } from './auth/access.guard';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { LogsPageComponent } from './pages/logs-page/logs-page.component';
import { DatabasePageComponent } from './pages/database-page/database-page.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page/forgot-password-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { ChatPageComponent } from './pages/chats-page/chat-page.component';
import { SubscribersPageComponent } from './pages/subscribers-page/subscribers-page.component';
export const routes: Routes = [
    { 
        path: '', component: LayoutComponent, children: [
            { path: '', component: SearchPageComponent },
            { path: 'profile/:id', component: ProfilePageComponent },
            { path: 'settings', component: SettingsPageComponent },
            { path: 'chats', component: ChatPageComponent},
            { path: 'search', component: SearchPageComponent},
            { path: 'subscribers', component: SubscribersPageComponent},


            { path: 'admin/users', component: UsersPageComponent, canActivate: [canActivateRole(['admin1', 'admin2'])] },
            { path: 'admin/logs', component: LogsPageComponent, canActivate: [canActivateRole(['admin2'])] },
            { path: 'admin/database', component: DatabasePageComponent, canActivate: [canActivateRole(['admin2'])] },

        ],
        canActivate: [canActivateAuth],
    },
    { path: 'login', component: LoginPageComponent},
    { path: 'register', component: RegisterPageComponent},

    { path: 'forgot-password', component: ForgotPasswordPageComponent},
    { path: 'reset-password', component: ResetPasswordPageComponent }, 
    { path: '404', component: NotFoundPageComponent },
    { path: '**', redirectTo: '/404'}
];


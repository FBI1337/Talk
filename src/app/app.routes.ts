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

export const routes: Routes = [
    { 
        path: '', component: LayoutComponent, children: [
            { path: '', component: SearchPageComponent },
            { path: 'profile/:id', component: ProfilePageComponent },
            { path: 'settings', component: SettingsPageComponent },


            { path: 'admin/users', component: UsersPageComponent, canActivate: [canActivateRole(['admin1', 'admin2'])] },
            { path: 'admin/logs', component: LogsPageComponent, canActivate: [canActivateRole(['admin2'])] },
            { path: 'admin/database', component: DatabasePageComponent, canActivate: [canActivateRole(['admin2'])] },

        ],
        canActivate: [canActivateAuth],
    },
    {path: 'login', component: LoginPageComponent},
    {path: 'register', component: RegisterPageComponent}
];


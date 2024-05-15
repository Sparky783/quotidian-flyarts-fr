import { Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { authGuard } from './_helpers/auth.guard';
import { LoginComponent } from './_components/login/login.component';
import { adminAuthGuard } from './_helpers/admin-auth.guard';
import { ProfileComponent } from './_components/profile/profile.component';
import { SiteManagerComponent } from './_components/site-manager/site-manager.component';

export const routes: Routes = [
    {
        path: '',
        title: 'Home page',
        canActivate: [authGuard],
        component: HomeComponent
    },
    {
        path: 'login',
        title: 'User login',
        component: LoginComponent
    },
    {
        path: 'profile',
        title: 'Profile',
        canActivate: [authGuard],
        component: ProfileComponent
    },
    {
        path: 'sites',
        title: 'Site manager',
        canActivate: [authGuard],
        component: SiteManagerComponent
    },
    {
        path: 'admin',
        title: 'Admin user manager',
        canActivate: [authGuard, adminAuthGuard],
        loadComponent: () => import('./admin/_components/users/users.component').then(m => m.UsersComponent)
    }
];

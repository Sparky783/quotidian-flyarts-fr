import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../_services/account.service';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const accountService: AccountService = inject(AccountService);

    // add auth header with jwt if user is logged in and request is to the api url
    const user = accountService.getUserValue();
    const isLoggedIn = user?.token;
    const isApiUrl = req.url.startsWith(environment.apiUrl);

    if (isLoggedIn && isApiUrl) {
        req = req.clone({
            setHeaders: { Authorization: `Bearer ${user.token}` }
        });
    }

    return next(req);
};

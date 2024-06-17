import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const accountService: AccountService = inject(AccountService);

    return next(req).pipe(catchError(err => {
        if ([401, 403].includes(err.status) && accountService.getUserValue()) {
            // Auto logout if 401 or 403 response returned from api
            accountService.logout();
        }

        const error = err.error?.message || err.statusText;
        //console.error(err);

        return throwError(() => error);
    }))
};

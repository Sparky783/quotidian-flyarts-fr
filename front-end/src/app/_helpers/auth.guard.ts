import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

// Check if the user is logged.

export const authGuard: CanActivateFn = (route, state) => {
    const router: Router = inject(Router);
    const accountService: AccountService = inject(AccountService);

    const user = accountService.getUserValue();

    if (user) {
        // Authorised so return true
        return true;
    }

    // Not logged in so redirect to login page with the return url
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
};

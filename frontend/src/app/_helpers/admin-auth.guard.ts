import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

// Check if the user is an admin.

export const adminAuthGuard: CanActivateFn = (route, state) => {
    const router: Router = inject(Router);
    const accountService: AccountService = inject(AccountService);

    const user = accountService.getUserValue();
    
    if (user?.isAdmin) {
        // Authorised so return true
        return true;
    }

    // Not logged in so redirect to login page with the return url
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
};

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../_services/account.service';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css'
})
export class UsersComponent {
    private router: Router = inject(Router);
    private accountService: AccountService = inject(AccountService);

    constructor() {
        // redirect to home if already logged in
        if (this.accountService.getUserValue()) {
            this.router.navigate(['/login']);
        }
    }
}

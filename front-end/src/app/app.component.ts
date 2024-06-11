
import { DatePipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AccountService } from './_services/account.service';
import { User } from './_interfaces/user';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        DatePipe,
        NgIf
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    private accountService: AccountService = inject(AccountService);

    public user?: User | null;

    constructor() {
        this.accountService.user.subscribe(user => this.user = user);

        if (this.accountService.getUserValue()) {
            this.user = this.accountService.getUserValue();
        }
    }
    
    title: string = 'Quotidian';
    date: Date = new Date();
}

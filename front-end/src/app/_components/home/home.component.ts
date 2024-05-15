import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { SiteService } from '../../_services/site.service';
import { User } from '../../_interfaces/user';
import { Site } from '../../_interfaces/site';
import { DatePipe, NgFor } from '@angular/common';
import { first } from 'rxjs';
import { Frequency } from '../../_helpers/frequency';
import { FrequencyPipe } from '../../_helpers/frequency.pipe';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        RouterLink,
        NgFor,
        FrequencyPipe,
        DatePipe
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    private accountService: AccountService = inject(AccountService);
    private siteService: SiteService = inject(SiteService);

    public user?: User | null;
    public sites: Site[] = [];
    public hasFilter: boolean = false;
    public filterFrequency: Frequency = Frequency.Daily;

    constructor() {
        this.accountService.user.subscribe(user => this.user = user);

        if (this.accountService.getUserValue()) {
            this.user = this.accountService.getUserValue();
        }
    }

    ngOnInit() {
        this.siteService.getSites(this.user?.id ?? -1)
            .pipe(first())
            .subscribe((sites) => {
                this.sites = sites;
                this.sortSites();
            });
    }

    openSite(site: Site) {
        this.siteService.openSite(site.id)
            .pipe(first())
            .subscribe(() => {
                window.open(site.url);
            });
    }

    clearFilter() {
        this.hasFilter = false;
    }

    selectFilter(frequency: string) {
        this.hasFilter = true;
        switch (frequency) {
            case 'daily':
                this.filterFrequency = Frequency.Daily;
                break;

            case 'weekly':
                this.filterFrequency = Frequency.Weekly;
                break;

            case 'monthly':
                this.filterFrequency = Frequency.Monthly;
                break;

            case 'yearly':
                this.filterFrequency = Frequency.Yearly;
                break;
        }
    }

    sortSites() {
        this.sites = this.sites.sort((site) => {
            return !site.toVisit ? 1 : -1;
        });
    }
}

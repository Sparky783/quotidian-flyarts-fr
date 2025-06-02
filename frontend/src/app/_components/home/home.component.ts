import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, NgFor } from '@angular/common';
import { first } from 'rxjs';

import { AccountService } from '../../_services/account.service';
import { SiteService } from '../../_services/site.service';

import { User } from '../../_interfaces/user';
import { Site } from '../../_interfaces/site';

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
    this.refresh();
  }

  refresh() {
    this.siteService.getSites(this.user?.idUser ?? -1)
      .pipe(first())
      .subscribe((sites) => {
        this.sites = sites;
        this.computeToVisitData();
        this.sortSites();
      });
  }

  openSite(site: Site) {
    this.siteService.openSite(site.idSite)
      .pipe(first())
      .subscribe(() => {
        window.open(site.url);
        this.refresh();
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

  computeToVisitData() {
    this.sites = this.sites.map((site) => {
      const today = new Date();
      const nextDate = new Date(site.nextDate);

      site.toVisit = today >= nextDate;

      return site;
    });
  }

  sortSites() {
    this.sites = this.sites.sort((site) => {
      return !site.toVisit ? 1 : -1;
    });
  }
}

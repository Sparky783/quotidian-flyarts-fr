import { Component, inject } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { SiteService } from '../../_services/site.service';
import { User } from '../../_interfaces/user';
import { Site } from '../../_interfaces/site';
import { first } from 'rxjs';
import { FrequencyPipe } from '../../_helpers/frequency.pipe';
import { DatePipe, NgFor, NgClass } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Frequency } from '../../_helpers/frequency';

@Component({
    selector: 'app-site-manager',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FrequencyPipe,
        DatePipe,
        NgFor,
        NgClass
    ],
    providers: [
        DatePipe
    ],
    templateUrl: './site-manager.component.html',
    styleUrl: './site-manager.component.css'
})
export class SiteManagerComponent {
    private formBuilder: FormBuilder = inject(FormBuilder);
    private modalService: NgbModal = inject(NgbModal);
    private accountService: AccountService = inject(AccountService);
    private siteService: SiteService = inject(SiteService);
    private datePipe: DatePipe = inject(DatePipe);

    public editSiteForm!: FormGroup;
    public submitted = false;
    public user?: User | null;
    public sites: Site[] = [];
    public selectedSite?: Site | null;
    public frequencyList = Object.values(Frequency);
    public editSiteFormTitle: string = "";
    public editSiteFormButton: string = "";
    public isEditAction: boolean = false; // False = Ajout, True = Edition

    constructor() {
        this.accountService.user.subscribe(user => this.user = user);

        if (this.accountService.getUserValue()) {
            this.user = this.accountService.getUserValue();
        }
    }

    ngOnInit() {
        this.editSiteForm = this.formBuilder.group({
            name: ['', Validators.required],
            url: ['', Validators.required],
            frequency: [0, Validators.required],
            nextDate: ['', Validators.required]
        });

        this.siteService.getSites(this.user?.idUser ?? -1)
            .pipe(first())
            .subscribe((sites) => {
                this.sites = sites;
            });
    }

    openSiteModal(site: Site | null, modal: any) {
        this.submitted = false;

        if (site != null) {
            this.isEditAction = true;
            this.editSiteFormTitle = "Modifier le site";
            this.editSiteFormButton = "Modifier";
            this.selectedSite = site;

            this.editSiteForm = this.formBuilder.group({
                name: [this.selectedSite.name, Validators.required],
                url: [this.selectedSite.url, Validators.required],
                frequency: [this.selectedSite.frequency, Validators.required],
                nextDate: [this.datePipe.transform(this.selectedSite.nextDate, 'yyyy-MM-dd'), Validators.required]
            });
        } else {
            this.isEditAction = false;
            this.editSiteFormTitle = "Ajouter un site";
            this.editSiteFormButton = "Ajouter";

            this.editSiteForm.reset();
        }

        this.modalService.open(modal);
    }

    onEditSite(modal: any) {
        this.submitted = true;
        this.editSiteForm.updateValueAndValidity();

        // Stop here if form is invalid
        if (this.editSiteForm.invalid) {
            return;
        }

        if (this.isEditAction) {
            if (!this.selectedSite)
                return;

            this.selectedSite.name = this.editSiteForm.value.name;
            this.selectedSite.url = this.editSiteForm.value.url;
            this.selectedSite.frequency = this.editSiteForm.value.frequency;
            this.selectedSite.nextDate = new Date(this.editSiteForm.value.nextDate);

            this.siteService.update(this.selectedSite)
                .pipe(first())
                .subscribe((sites) => {
                    this.sites = sites;
                    modal.close();
                });
        } else {
            this.selectedSite = { idUser: this.user?.idUser } as Site;
            this.selectedSite.name = this.editSiteForm.value.name;
            this.selectedSite.url = this.editSiteForm.value.url;
            this.selectedSite.frequency = this.editSiteForm.value.frequency;
            this.selectedSite.nextDate = new Date(this.editSiteForm.value.nextDate);
            this.selectedSite.lastVisit = new Date();
            this.selectedSite.toVisit = false;

            this.siteService.add(this.selectedSite)
                .pipe(first())
                .subscribe((sites) => {
                    this.sites = sites;
                    modal.close();
                });
        }
    }

    removeSite(modal: any) {
        if (!this.selectedSite)
            return;

        let site = this.selectedSite;
        this.siteService.delete(site.idSite)
            .pipe(first())
            .subscribe(() => {
                this.sites = this.sites.filter(s => s.idSite !== site.idSite);
                modal.close();
            });
    }
}

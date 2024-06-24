import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteManagerComponent } from './site-manager.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SiteService } from '../../_services/site.service';
import { Observable } from 'rxjs';
import { Frequency } from '../../_helpers/frequency';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

describe('SiteManagerComponent', () => {
    const siteDatabase = [
        {
            id: 0,
            userId: 1,
            name: "Site 1",
            url: "Lien vers le site 1",
            frequency: Frequency.Monthly,
            nextDate: new Date("2024/03/12"),
            toVisit: true,
            lastVisit: new Date("2024/03/12"),
        },
        {
            id: 1,
            userId: 1,
            name: "Site 2",
            url: "Lien vers le site 2",
            frequency: Frequency.Monthly,
            nextDate: new Date("2024/03/12"),
            toVisit: false,
            lastVisit: new Date("2024/03/12"),
        },
        {
            id: 2,
            userId: 1,
            name: "Site 3",
            url: "Lien vers le site 3",
            frequency: Frequency.Weekly,
            nextDate: new Date("2024/03/12"),
            toVisit: true,
            lastVisit: new Date("2024/03/12"),
        }
    ];

    let component: SiteManagerComponent;
    let fixture: ComponentFixture<SiteManagerComponent>;

    let prepareTestWithoutUserData = () => {
        TestBed.configureTestingModule({
            imports: [
                SiteManagerComponent,
                HttpClientTestingModule
            ],
            providers: [
                provideRouter(routes)
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SiteManagerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    let prepareTestWithUserData = () => {
        const mockSiteService = jasmine.createSpyObj('SiteService', ['getSites']);
        mockSiteService.getSites.and.returnValue(new Observable((subscriber) => {
                subscriber.next(siteDatabase);
                subscriber.complete();
            })
        );

        TestBed.configureTestingModule({
            imports: [
                SiteManagerComponent,
                HttpClientTestingModule
            ],
            providers: [
                provideRouter(routes),
                { provide: SiteService, useValue: mockSiteService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SiteManagerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    it('should be created', () => {
        // Prepare
        prepareTestWithoutUserData();

        // Assert
        expect(component).toBeTruthy();
    });

    it('should inform when the user has no site', () => {
        // Prepare
        prepareTestWithoutUserData();
        let tableContent: HTMLElement = fixture.nativeElement.querySelector('.card-body tbody tr:first-child');

        // Assert
        expect(tableContent.textContent).toContain("Aucun site n'est enregistré.");
    });

    it('should display add/edit modal', () => {
        // Prepare
        prepareTestWithoutUserData();
        spyOn(component, 'openSiteModal');

        // Run
        let button: HTMLElement = fixture.nativeElement.querySelector('.card-header button');
        button.click();

        // Assert
        expect(component.openSiteModal).toHaveBeenCalled();
    });

    it('should display add/edit modal when there are not site', () => {
        // Prepare
        prepareTestWithoutUserData();
        spyOn(component, 'openSiteModal');

        // Run
        let button: HTMLElement = fixture.nativeElement.querySelector('#tableSites tbody button');
        button.click();

        // Assert
        expect(component.openSiteModal).toHaveBeenCalled();
    });

    it('should display add/edit modal to edit site', () => {
        // Prepare
        prepareTestWithUserData();
        spyOn(component, 'openSiteModal');

        // Run
        let button: HTMLElement = fixture.nativeElement.querySelector('#tableSites tbody button.modify-site');
        button.click();

        // Assert
        expect(component.openSiteModal).toHaveBeenCalled();
    });

    it('should display remove modal', () => {
        // Prepare
        prepareTestWithUserData();
        spyOn(component, 'openSiteModal');

        // Run
        let button: HTMLElement = fixture.nativeElement.querySelector('#tableSites tbody button.remove-site');
        button.click();

        // Assert
        expect(component.openSiteModal).toHaveBeenCalled();
    });

    // it('should call add site function when everything is good to add site', async () => {
    //     // Prepare
    //     prepareTestWithoutUserData();
    //     spyOn(component, 'openSiteModal');
    //     spyOn(component, 'onEditSite');

    //     // Run
    //     let button: HTMLElement = fixture.nativeElement.querySelector('.card-header button');
    //     button.click();
    //     component.openSiteModal(null, );
    //     await fixture.detectChanges();

    //     component.editSiteForm.controls['name'].setValue("New site test");
    //     component.editSiteForm.controls['url'].setValue("http://new-url-test.com");
    //     component.editSiteForm.controls['frequency'].setValue("weekly");
    //     component.editSiteForm.controls['nextDate'].setValue("2024-05-14");

    //     let modalForm: HTMLElement = fixture.nativeElement.querySelector('#editSiteForm');
    //     console.log(modalForm);
    //     console.log(fixture);
    //     //modalForm.submit();

    //     // Assert
    //     expect(component.openSiteModal).toHaveBeenCalled();
    //     expect(component.onEditSite).toHaveBeenCalled();
    // });

    // it('should call edit site function when everything is good to edit site', () => {
    //     // Prepare
    //     prepareTestWithoutUserData();
    //     spyOn(component, 'openSiteModal');

    //     // Run
    //     let button: HTMLElement = fixture.nativeElement.querySelector('.card-header button');
    //     button.click();

    //     // Assert
    //     expect(component.openSiteModal).toHaveBeenCalled();
    // });

    // it('should call remove site function when everything is good to remove site', () => {
    //     // Prepare
    //     prepareTestWithoutUserData();
    //     spyOn(component, 'openSiteModal');

    //     // Run
    //     let button: HTMLElement = fixture.nativeElement.querySelector('.card-header button');
    //     button.click();

    //     // Assert
    //     expect(component.openSiteModal).toHaveBeenCalled();
    // });
});

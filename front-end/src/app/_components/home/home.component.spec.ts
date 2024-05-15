import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { SiteService } from '../../_services/site.service';
import { Frequency } from '../../_helpers/frequency';
import { AccountService } from '../../_services/account.service';
import { Observable, of } from 'rxjs';

describe('HomeComponent', () => {
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

    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    let prepareTestWithoutUserData = () => {
        TestBed.configureTestingModule({
            imports: [
                HomeComponent,
                HttpClientTestingModule
            ],
            providers: [
                provideRouter(routes)
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
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
                HomeComponent,
                HttpClientTestingModule
            ],
            providers: [
                provideRouter(routes),
                { provide: SiteService, useValue: mockSiteService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
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
        let tableContent: HTMLElement = fixture.nativeElement.querySelector('.card-body tr:first-child');

        // Assert
        expect(tableContent.textContent).toContain("Aucun site n'est enregistré.");
    });

    it('should display user sites with no filter', () => {
        // Prepare
        prepareTestWithUserData();
        let tableContent: HTMLElement[] = fixture.nativeElement.querySelectorAll('.card-body tr');

        // Assert
        expect(tableContent.length).toEqual(3);
    });

    it('should display filtered user sites (Daily)', () => {
        // Prepare
        prepareTestWithUserData();
        component.selectFilter("daily");
        fixture.detectChanges();

        let tableContent: HTMLElement[] = fixture.nativeElement.querySelectorAll('.card-body tr');

        // Assert
        expect(tableContent.length).toEqual(0);
    });

    it('should display filtered user sites (Weekly)', () => {
        // Prepare
        prepareTestWithUserData();
        component.selectFilter("weekly");
        fixture.detectChanges();
        let tableContent: HTMLElement[] = fixture.nativeElement.querySelectorAll('.card-body tr');

        // Assert
        expect(tableContent.length).toEqual(1);
    });
    
    it('should display filtered user sites (Monthly)', () => {
        // Prepare
        prepareTestWithUserData();
        component.selectFilter("monthly");
        fixture.detectChanges();

        let tableContent: HTMLElement[] = fixture.nativeElement.querySelectorAll('.card-body tr');

        // Assert
        expect(tableContent.length).toEqual(2);
    });
    
    it('should display filtered user sites (Yealy)', () => {
        // Prepare
        prepareTestWithUserData();
        component.selectFilter("yearly");
        fixture.detectChanges();

        let tableContent: HTMLElement[] = fixture.nativeElement.querySelectorAll('.card-body tr');

        // Assert
        expect(tableContent.length).toEqual(0);
    });

    it('should sort user site', () => {
        // Prepare
        prepareTestWithUserData();
        let tableContent: HTMLElement[] = fixture.nativeElement.querySelectorAll('.card-body tr');

        // Assert
        expect(tableContent[0].innerHTML).not.toContain("fa-check");
        expect(tableContent[1].innerHTML).not.toContain("fa-check");
        expect(tableContent[2].innerHTML).toContain("fa-check");
    });
});

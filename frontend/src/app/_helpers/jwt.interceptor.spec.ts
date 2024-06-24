import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { jwtInterceptor } from './jwt.interceptor';
import { AccountService } from '../_services/account.service';
import { environment } from '../../environments/environment';

describe('jwtInterceptor', () => {
    const mockAccountService = jasmine.createSpyObj('AccountService', ['getUserValue']);

    let httpTestingController: HttpTestingController;
    let httpClient: HttpClient;

    const interceptor: HttpInterceptorFn = (req, next) =>
        TestBed.runInInjectionContext(() => jwtInterceptor(req, next));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([jwtInterceptor])),
                provideHttpClientTesting(),
                { provide: AccountService, useValue: mockAccountService }
            ],
        });

        httpTestingController = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);

        mockAccountService.getUserValue.and.returnValue({
            id: 76,
            email: "jwt@jwt.jwt",
            password: "",
            name: "JWT Authorization",
            isAdmin: false,
            token: "[the token]"
        });
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        // Assert
        expect(interceptor).toBeTruthy();
    });

    it('should add auth headers', () => {
        // Prepare
        const url = `${environment.apiUrl}/mockendpoint`;

        // Run test
        httpClient.get(url).subscribe();

        // Assert
        const req = httpTestingController.expectOne(url);
        expect(req.request.headers.get('Authorization')).toEqual(
            'Bearer [the token]'
        );
    });
});

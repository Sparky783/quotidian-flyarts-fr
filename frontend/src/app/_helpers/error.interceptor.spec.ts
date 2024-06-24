import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { errorInterceptor } from './error.interceptor';
import { AccountService } from '../_services/account.service';
import { environment } from '../../environments/environment';

describe('errorInterceptor', () => {
    let mockAccountService: any;
    let httpTestingController: HttpTestingController;
    let httpClient: HttpClient;

    const interceptor: HttpInterceptorFn = (req, next) =>
        TestBed.runInInjectionContext(() => errorInterceptor(req, next));

    beforeEach(() => {
        mockAccountService = jasmine.createSpyObj('AccountService', ['getUserValue', 'logout']);

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([errorInterceptor])),
                provideHttpClientTesting(),
                { provide: AccountService, useValue: mockAccountService }
            ]
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
        expect(interceptor).toBeTruthy();
    });

    it('should logout on HTTP 401 error (Unauthorized)', () => {
        // Prepare
        const url = `${environment.apiUrl}/mockendpoint`;
        const mockErrorResponse = { status: 401, statusText: 'Unauthorized' };
        const mockErrorResponseData = { message: 'Error HTTP 401' };

        // Run test
        httpClient.get(url).subscribe(
            () => fail('Expected error, not response'),
            (error: HttpErrorResponse) => {
                expect(mockAccountService.logout).toHaveBeenCalled();
            }
        );

        // Assert
        const req = httpTestingController.expectOne(url);
        req.flush(mockErrorResponseData, mockErrorResponse);
    });

    it('should logout on HTTP 403 error (Forbidden)', () => {
        // Prepare
        const url = `${environment.apiUrl}/mockendpoint`;
        const mockErrorResponse = { status: 403, statusText: 'Forbidden' };
        const mockErrorResponseData = { message: 'Error HTTP 403' };

        // Run test
        httpClient.get(url).subscribe(
            () => fail('Expected error, not response'),
            (error: HttpErrorResponse) => {
                expect(mockAccountService.logout).toHaveBeenCalled();
            }
        );

        // Assert
        const req = httpTestingController.expectOne(url);
        req.flush(mockErrorResponseData, mockErrorResponse);
    });

    it('should not logout on HTTP 404 error (Not found)', () => {
        // Prepare
        const url = `${environment.apiUrl}/mockendpoint`;
        const mockErrorResponse = { status: 404, statusText: 'Forbidden' };
        const mockErrorResponseData = { message: 'Error HTTP 404' };

        // Run test
        httpClient.get(url).subscribe(
            () => fail('Expected error, not response'),
            (error: HttpErrorResponse) => {
                expect(mockAccountService.logout).not.toHaveBeenCalled();
            }
        );

        // Assert
        const req = httpTestingController.expectOne(url);
        req.flush(mockErrorResponseData, mockErrorResponse);
    });
});

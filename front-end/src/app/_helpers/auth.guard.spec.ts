import { TestBed, fakeAsync } from '@angular/core/testing';
import { ActivatedRoute, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { AccountService } from '../_services/account.service';
import { Observable, of } from 'rxjs';

describe('authGuard', () => {
    let activetedRoute: ActivatedRoute;
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const mockAccountService = jasmine.createSpyObj('AccountService', ['getUserValue']);

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => authGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                { provide: ActivatedRoute, useValue: { snapshot: {} } },
                { provide: Router, useValue: mockRouter },
                { provide: AccountService, useValue: mockAccountService }
            ]
        });
        
        activetedRoute = TestBed.inject(ActivatedRoute);
    });

    it('should be created', () => {
        // Assert
        expect(executeGuard).toBeTruthy();
    });

    it('should authorize logged in user', () => {
        // Prepare
        mockAccountService.getUserValue.and.returnValue({
            id: 15,
            email: "test@test.test",
            password: "password",
            name: "Test Name",
            isAdmin: false,
            token: "string"
        });

        // Run test
        const result = TestBed.runInInjectionContext(() => {
            return authGuard(activetedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
        });

        // Assert
        expect(result).toBeTrue();
    });

    it('should block user if he is not logged in', () => {
        // Prepare
        mockAccountService.getUserValue.and.returnValue(null);

        // Run test
        const result = TestBed.runInInjectionContext(() => {
            return authGuard(activetedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
        });

        // Assert
        expect(result).toBeFalse();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: undefined } });
    });
});

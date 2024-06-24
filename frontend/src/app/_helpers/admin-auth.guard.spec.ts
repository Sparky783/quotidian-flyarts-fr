import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { adminAuthGuard } from './admin-auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { AccountService } from '../_services/account.service';
import { Observable } from 'rxjs';

describe('adminAuthGuard', () => {
    let activetedRoute: ActivatedRoute;
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const mockAccountService = jasmine.createSpyObj('AccountService', ['getUserValue']);

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => adminAuthGuard(...guardParameters));

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

    it('should authorize admin user', () => {
        // Prepare
        mockAccountService.getUserValue.and.returnValue({
            id: 15,
            email: "admin@test.test",
            password: "root",
            name: "Admin Test",
            isAdmin: true,
            token: "string"
        });

        // Run test
        const result = TestBed.runInInjectionContext(() => {
            return adminAuthGuard(activetedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
        });

        // Assert
        expect(result).toBeTrue();
    });

    it('should block non admin user', () => {
        // Prepare
        mockAccountService.getUserValue.and.returnValue({
            id: 15,
            email: "guest@test.test",
            password: "",
            name: "Guest Test",
            isAdmin: false,
            token: "string"
        });

        // Run test
        const result = TestBed.runInInjectionContext(() => {
            return adminAuthGuard(activetedRoute.snapshot, {} as RouterStateSnapshot) as Observable<boolean>;
        });

        // Assert
        expect(result).toBeFalse();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: undefined } });
    });
});

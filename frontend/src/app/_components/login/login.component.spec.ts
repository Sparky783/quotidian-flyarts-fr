import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                LoginComponent,
                HttpClientTestingModule
            ],
            providers: [
                provideRouter(routes)
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        // Assert
        expect(component).toBeTruthy();
    });

    it('should not display error if there is no one', () => {
        // Prepare
        component.error = "";
        fixture.detectChanges();
        let errorDom: HTMLElement = fixture.nativeElement.querySelector('.card-body .alert-danger');

        // Assert
        expect(errorDom).toBeNull();
    });
    
    it('should display error if there is one', () => {
        // Prepare
        component.error = "Test error";
        fixture.detectChanges();
        let errorDom: HTMLElement = fixture.nativeElement.querySelector('.card-body .alert-danger');

        // Assert
        expect(errorDom).toBeTruthy();
    });

    it('should infrom when user does not fill the E-mail input', () => {
        // Prepare
        let inputDom: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="email"]');
        
        component.onSubmit();
        fixture.detectChanges();

        // Assert
        expect(inputDom.parentElement?.innerHTML).toContain("E-mail est requis");
    });

    it('should infrom when user does not fill the password input', () => {
        // Prepare
        let inputDom: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="password"]');
        
        component.onSubmit();
        fixture.detectChanges();

        // Assert
        expect(inputDom.parentElement?.innerHTML).toContain("Le mot de passe est requis");
    });
    
    it('should infrom when user does not fill the email input correctly', () => {
        // Prepare
        let inputDom: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="email"]');
        
        component.form.controls['email'].setValue("wrongEmailFormat");
        component.onSubmit();
        fixture.detectChanges();

        // Assert
        expect(inputDom.parentElement?.innerHTML).toContain("Le format n'est pas correct");
    });
});

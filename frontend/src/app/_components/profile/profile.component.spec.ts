import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountService } from '../../_services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../../_interfaces/user';

describe('ProfileComponent', () => {
    const fakeUserData = {
        id: 0,
        email: "test.test@gmail.com",
        password: "test",
        name: "Test Name",
        isAdmin: true
    };

    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;

    const mockAccountService = jasmine.createSpyObj('AccountService', ['user', 'editInfos', 'editPassword']);
    mockAccountService.user = new Observable((subscriber) => {
        subscriber.next(fakeUserData);
        subscriber.complete();
    });
    mockAccountService.editInfos.and.returnValue(new Observable((subscriber) => {
            subscriber.next(fakeUserData);
            subscriber.complete();
        })
    );
    mockAccountService.editPassword.and.returnValue(new Observable((subscriber) => {
            subscriber.next(fakeUserData);
            subscriber.complete();
        })
    );

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ProfileComponent,
                HttpClientTestingModule
            ],
            providers: [
                { provide: AccountService, useValue: mockAccountService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        // Assert
        expect(component).toBeTruthy();
    });

    it('should be display the current name', () => {
        // Prepare
        let titleDom: HTMLElement = fixture.nativeElement.querySelector("#entete");

        // Assert
        expect(titleDom.textContent?.trim()).toEqual("Test Name");
    });
    
    it('should not infrom user about infos fields when the page is loaded.', () => {
        // Prepare
        let inputDom: HTMLInputElement = fixture.nativeElement.querySelector('#nameInput');

        // Assert
        expect(inputDom.parentElement?.innerHTML).not.toContain("Un nom est requis");
    });

    it('should inform when user does not fill the name input', () => {
        // Prepare
        let inputDom: HTMLInputElement = fixture.nativeElement.querySelector('#nameInput');

        // Run
        component.editInfosForm.controls['name'].setValue(""); // Clear value
        component.onEditInfosSubmit();
        fixture.detectChanges();

        // Assert
        expect(inputDom.parentElement?.innerHTML).toContain("Un nom est requis");
    });
    
    // it('user should change his name', () => {
    //     // Prepare
    //     const username = "New test name";

    //     // Run
    //     component.editInfosForm.controls['name'].setValue(username);
    //     component.onEditInfosSubmit();
    //     fixture.detectChanges();

    //     // Assert
    //     expect(mockAccountService.editInfos).toHaveBeenCalledWith(0, username);
    // });

    it('should not infrom user about password fields when the page is loaded.', () => {
        // Prepare
        let oldPasswordInputDom: HTMLInputElement = fixture.nativeElement.querySelector('#oldPassword');
        let newPasswordInputDom: HTMLInputElement = fixture.nativeElement.querySelector('#newPassword');
        let confirmPassworInputDom: HTMLInputElement = fixture.nativeElement.querySelector('#confirmPassword');

        // Assert
        expect(oldPasswordInputDom.parentElement?.innerHTML).not.toContain("Veuillez fournir l'ancien mot de passe");
        expect(newPasswordInputDom.parentElement?.innerHTML).not.toContain("Un mot de passe est nécessaire");
        expect(confirmPassworInputDom.parentElement?.innerHTML).not.toContain("Veuillez confirmer le mot de passe");
    });

    it('should infrom when user does not fill the old password input', () => {
        // Prepare
        let inputDom: HTMLInputElement = fixture.nativeElement.querySelector('#oldPassword');
        
        // Run
        component.onEditPasswordSubmit();
        fixture.detectChanges();

        // Assert
        expect(inputDom.parentElement?.innerHTML).toContain("Veuillez fournir l'ancien mot de passe");
    });

    it('should infrom when user does not fill the new password input', () => {
        // Prepare
        let inputDom: HTMLInputElement = fixture.nativeElement.querySelector('#newPassword');
        
        component.onEditPasswordSubmit();
        fixture.detectChanges();

        // Assert
        expect(inputDom.parentElement?.innerHTML).toContain("Un mot de passe est nécessaire");
    });
    
    it('should infrom when user does not fill the confirm password input', () => {
        // Prepare
        let inputDom: HTMLInputElement = fixture.nativeElement.querySelector('#confirmPassword');
        
        component.onEditPasswordSubmit();
        fixture.detectChanges();

        // Assert
        expect(inputDom.parentElement?.innerHTML).toContain("Veuillez confirmer le mot de passe");
    });
    
    // it('user should change his password', () => {
    //     // Prepare
    //     const oldPassword = "old password";
    //     const newPassword = "new password";
    //     const confirmPassword = "confirm password";
        
    //     // Run
    //     component.editPasswordForm.controls['oldPassword'].setValue(oldPassword);
    //     component.editPasswordForm.controls['newPassword'].setValue(newPassword);
    //     component.editPasswordForm.controls['confirmPassword'].setValue(confirmPassword);
    //     component.onEditPasswordSubmit();
    //     fixture.detectChanges();

    //     // Assert
    //     expect(mockAccountService.editPassword).toHaveBeenCalledWith(0, oldPassword, newPassword, confirmPassword);
    // });
});

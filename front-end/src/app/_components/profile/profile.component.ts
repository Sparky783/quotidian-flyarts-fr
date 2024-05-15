import { Component, inject } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_interfaces/user';
import { NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { first } from 'rxjs';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgIf,
        NgClass
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent {
    private formBuilder: FormBuilder = inject(FormBuilder);
    private accountService: AccountService = inject(AccountService);

    public editInfosForm!: FormGroup;
    public editPasswordForm!: FormGroup;
    public user?: User | null;
    public infosSubmitted = false;
    public passwordSubmitted = false;
    public error: string = "";
    public success: string = "";

    constructor() {
        this.accountService.user.subscribe(user => this.user = user);
    }

    ngOnInit() {
        this.editInfosForm = this.formBuilder.group({
            name: [this.user?.name, Validators.required]
        });

        this.editPasswordForm = this.formBuilder.group({
            oldPassword: ['', Validators.required],
            newPassword: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        });
    }

    onEditInfosSubmit() {
        this.infosSubmitted = true;

        this.removeAlerts();
        this.editInfosForm.updateValueAndValidity();

        // Stop here if form is invalid
        if (this.editInfosForm.invalid) {
            return;
        }

        this.accountService.editInfos(this.user?.id as number, this.editInfosForm.value.name)
            .pipe(first())
            .subscribe({
                next: user => {
                    this.success = "Le nom à bien été mis à jour.";
                },
                error: error => {
                    this.error = error;
                }
            });
    }

    onEditPasswordSubmit() {
        this.passwordSubmitted = true;

        this.removeAlerts();
        this.editPasswordForm.updateValueAndValidity();

        // Stop here if form is invalid
        if (this.editPasswordForm.invalid) {
            return;
        }

        this.accountService.editPassword(this.user?.id as number, this.editPasswordForm.value.oldPassword, this.editPasswordForm.value.newPassword, this.editPasswordForm.value.confirmPassword)
            .pipe(first())
            .subscribe({
                next: user => {
                    this.success = "Le mot de passe à bien été mis à jour.";
                    this.passwordSubmitted = false;
                    this.editPasswordForm.reset();
                },
                error: error => {
                    this.error = error;
                }
            });
    }

    clickLogout() {
        this.accountService.logout();
    }

    removeAlerts() {
        this.error = "";
        this.success = "";
    }
}

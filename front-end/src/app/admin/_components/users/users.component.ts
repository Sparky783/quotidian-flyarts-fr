import { Component, inject } from '@angular/core';
import { AccountService } from '../../../_services/account.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgFor } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../_interfaces/user';
import { first } from 'rxjs';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgFor,
        NgClass
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css'
})
export class UsersComponent {
    private formBuilder: FormBuilder = inject(FormBuilder);
    private bootstrapModal: NgbModal = inject(NgbModal);
    private accountService: AccountService = inject(AccountService);

    public editUserForm!: FormGroup;
    public submitted = false;
    public user?: User | null;
    public users: User[] = [];
    public selectedUser?: User | null;
    public editUserFormTitle: string = "";
    public editUserFormButton: string = "";
    public isEditAction: boolean = false; // False = Ajout, True = Edition

    constructor() {
        this.accountService.user.subscribe(user => this.user = user);

        if (this.accountService.getUserValue()) {
            this.user = this.accountService.getUserValue();
        }
    }

    ngOnInit() {
        this.editUserForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            name: ['', Validators.required],
            status: [''],
        });

        this.accountService.getAll()
            .pipe()
            .subscribe((users) => {
                this.users = users;
                console.log(users);
            });
    }

    ngOnDestroy() {
        this.bootstrapModal.dismissAll();
    }

    openUserModal(user: User | null, modal: any) {
        this.submitted = false;

        if (user != null) {
            this.isEditAction = true;
            this.editUserFormTitle = "Modifier l'utilisateur";
            this.editUserFormButton = "Modifier";
            this.selectedUser = user;

            this.editUserForm = this.formBuilder.group({
                email: [this.selectedUser.email, [Validators.required, Validators.email]],
                name: [this.selectedUser.name, Validators.required],
                status: [this.selectedUser.status],
            });
        } else {
            this.isEditAction = false;
            this.editUserFormTitle = "Ajouter un utilisateur";
            this.editUserFormButton = "Ajouter";

            this.editUserForm.reset();
        }

        this.bootstrapModal.open(modal);
    }

    onEditUser(modal: any) {
        this.submitted = true;
        this.editUserForm.updateValueAndValidity();

        // Stop here if form is invalid
        if (this.editUserForm.invalid) {
            return;
        }

        if (this.isEditAction) {
            if (!this.selectedUser)
                return;

            this.selectedUser.email = this.editUserForm.value.email;
            this.selectedUser.name = this.editUserForm.value.name;
            this.selectedUser.status = this.editUserForm.value.status;

            this.accountService.update(this.selectedUser)
                .pipe(first())
                .subscribe((users) => {
                    this.users = users;
                    modal.close();
                });
        } else {
            this.selectedUser = { idUser: this.user?.idUser } as User;
            this.selectedUser.email = this.editUserForm.value.email;
            this.selectedUser.name = this.editUserForm.value.name;
            this.selectedUser.status = this.editUserForm.value.status;

            this.accountService.addUser(this.selectedUser)
                .pipe(first())
                .subscribe((users) => {
                    this.users = users;
                    modal.close();
                });
        }
    }

    removeUser(modal: any) {
        if (!this.selectedUser)
            return;

        let user = this.selectedUser;
        this.accountService.delete(user.idUser as number)
            .pipe(first())
            .subscribe(() => {
                this.users = this.users.filter(u => u.idUser !== user.idUser);
                modal.close();
            });
    }
}

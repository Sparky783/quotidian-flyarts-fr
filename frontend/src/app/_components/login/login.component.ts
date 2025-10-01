import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_interfaces/user';
import { first } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private accountService: AccountService = inject(AccountService);

  public form!: FormGroup;
  public loading = false;
  public submitted = false;
  public user?: User | null;
  public error: string = "";

  constructor() {
    // Redirect to home if already logged in
    if (this.accountService.getUserValue()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [true]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.error = "";

    this.form.updateValueAndValidity();

    // Stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.login(this.form.value.email, this.form.value.password, this.form.value.rememberMe)
      .pipe(first())
      .subscribe({
        next: () => {
          // Get return url from query parameters or default to home page
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
          this.loading = false;
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }
}

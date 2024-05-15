import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_interfaces/user';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private router: Router = inject(Router);
    private http: HttpClient = inject(HttpClient);
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor() {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public getUserValue() {
        return this.userSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<User>(`${environment.apiUrl}/users/login`, { email, password })
            .pipe(map(user => {
                // Store user details and jwt token in local storage to keep user logged in between page refreshes (developpement)
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // Remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    editInfos(id: number, name: string) {
        return this.http.post<User>(`${environment.apiUrl}/users/infos/${id}`, name)
            .pipe(map(user => {
                // Store user details and jwt token in local storage to keep user logged in between page refreshes (developpement)
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    editPassword(id: number, oldPassword: string, newPassword: string, confirmPassword: string) {
        return this.http.post<User>(`${environment.apiUrl}/users/password/${id}`, {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        })
            .pipe(map(user => {
                // Store user details and jwt token in local storage to keep user logged in between page refreshes (developpement)
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    addUser(user: User) {
        return this.http.post(`${environment.apiUrl}/users/password`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id: number, params: any) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // Update stored user if the logged in user updated their own record
                if (id == this.getUserValue()?.id) {
                    // Update local storage
                    const user = { ...this.getUserValue(), ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // Publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // Auto logout if the logged in user deleted their own record
                if (id == this.getUserValue()?.id) {
                    this.logout();
                }
                return x;
            }));
    }
}
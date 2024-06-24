import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
        return this.http.post<User>(`${environment.apiUrl}/users/login`, { email, password }, { withCredentials: true })
            .pipe(
                map(user => {
                    user.isAdmin = user.status === "admin";
                    console.log(user);

                    // Store user details and jwt token in local storage to keep user logged in between page refreshes (developpement)
                    localStorage.setItem('user', JSON.stringify(user));
                    this.userSubject.next(user);
                    return user;
                })
            );
    }

    logout() {
        // Remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    editInfos(id: number, name: string) {
        return this.http.put<User>(`${environment.apiUrl}/users/infos/${id}`, name, { withCredentials: true })
            .pipe(map(user => {
                // Store user details and jwt token in local storage to keep user logged in between page refreshes (developpement)
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    editPassword(id: number, oldPassword: string, newPassword: string, confirmPassword: string) {
        return this.http.put<User>(`${environment.apiUrl}/users/password/${id}`, {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        }, { withCredentials: true })
            .pipe(map(user => {
                // Store user details and jwt token in local storage to keep user logged in between page refreshes (developpement)
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    addUser(user: User) {
        return this.http.post<User[]>(`${environment.apiUrl}/users`, user, { withCredentials: true });
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`, { withCredentials: true });
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`, { withCredentials: true });
    }

    update(user: User) {
        return this.http.put<User[]>(`${environment.apiUrl}/users/${user.idUser}`, user, { withCredentials: true })
            .pipe(map(x => {
                // Update stored user if the logged in user updated their own record
                if (user.idUser === this.getUserValue()?.idUser) {
                    // Update local storage
                    const userData = { ...this.getUserValue(), ...user };
                    localStorage.setItem('user', JSON.stringify(userData));

                    // Publish updated user to subscribers
                    this.userSubject.next(userData);
                }
                
                return x;
            }));
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`, { withCredentials: true })
            .pipe(map(x => {
                // Auto logout if the logged in user deleted their own record
                if (id == this.getUserValue()?.idUser) {
                    this.logout();
                }
                return x;
            }));
    }
}
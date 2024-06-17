import { HttpInterceptorFn } from '@angular/common/http';
import { HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../_interfaces/user';
import { Site } from '../_interfaces/site';
import { Frequency } from './frequency';

// ==== Databases ====
const usersKey = 'quotidian-users';
const sitesKey = 'quotidian-sites';
let users: any[] = JSON.parse(localStorage.getItem(usersKey)!) || [];

if (!users.find(user => user.email === "florent.lavignotte@gmail.com")) {
    users.push({
        id: 0,
        email: "florent.lavignotte@gmail.com",
        password: "test",
        name: "Florent Lavignotte",
        isAdmin: true
    });
}

let sites: any[] = JSON.parse(localStorage.getItem(sitesKey)!) || [];

if (sites.length == 0) {
    sites = [
        { id: 0, userId: 0, name: "Actualité", url: "https://www.francetvinfo.fr/", frequency: Frequency.Daily, nextDate: new Date("2024/03/25"), lastVisit: new Date("2024/03/08"), toVisit: false },
        { id: 1, userId: 0, name: "Sport", url: "https://www.lequipe.fr/", frequency: Frequency.Weekly, nextDate: new Date("2024/03/18"), lastVisit: new Date("2024/03/08"), toVisit: false },
        { id: 3, userId: 0, name: "Musique", url: "https://www.radiofrance.fr/", frequency: Frequency.Weekly, nextDate: new Date("2024/03/16"), lastVisit: new Date("2024/03/08"), toVisit: true },
        { id: 2, userId: 1, name: "Jeux", url: "https://www.jeuxvideo.com/", frequency: Frequency.Monthly, nextDate: new Date("2024/03/25"), lastVisit: new Date("2024/03/08"), toVisit: true },
        { id: 5, userId: 1, name: "Facebook", url: "https://www.facebook.com/", frequency: Frequency.Daily, nextDate: new Date("2024/03/25"), lastVisit: new Date("2024/03/08"), toVisit: false },
        { id: 6, userId: 2, name: "Gmail", url: "https://www.google.com/intl/fr/gmail/about/", frequency: Frequency.Yearly, nextDate: new Date("2024/03/25"), lastVisit: new Date("2024/03/08"), toVisit: true },
        { id: 7, userId: 1, name: "Amazon", url: "https://www.amazon.fr/", frequency: Frequency.Daily, nextDate: new Date("2024/03/25"), lastVisit: new Date("2024/03/08"), toVisit: true },
        { id: 8, userId: 0, name: "AliExpress", url: "https://www.aliexpress.us/", frequency: Frequency.Monthly, nextDate: new Date("2024/03/25"), lastVisit: new Date("2024/03/08"), toVisit: true },
        { id: 9, userId: 1, name: "M6 Reply", url: "https://www.6play.fr/", frequency: Frequency.Daily, nextDate: new Date("2024/03/25"), lastVisit: new Date("2024/03/08"), toVisit: true },
    ];
}

// Fake Back-end
export const fakeBackendInterceptor: HttpInterceptorFn = (req, next) => {
    const { url, method, headers, body } = req;

    return handleRoute();

    function handleRoute() {
        switch (true) {
            case url.endsWith('/users/login') && method === 'POST':
                return login();

            case url.match(/\/users\/infos\/\d+$/) && method === 'POST':
                return updateInfos();

            case url.match(/\/users\/password\/\d+$/) && method === 'POST':
                return updatePassword();

            case url.match(/\/sites\/\d+$/) && method === 'GET':
                return getSites();

            case url.endsWith('/sites') && method === 'POST':
                return addSite();

            case url.endsWith('/sites') && method === 'PUT':
                return updateSite();

            case url.match(/\/sites\/\d+$/) && method === 'DELETE':
                return deleteSite();

            case url.endsWith('/sites/open') && method === 'POST':
                return openSite();

            default:
                // pass through any requests not handled above
                return next(req);
        }
    }

    // Route functions
    function login() {
        let params: User = body as User
        const user = users.find(user => user.email === params.email && user.password === params.password);

        if (!user) {
            return error('E-mail or password is incorrect');
        }

        return ok(addToken(user))
    }

    function updateInfos() {
        if (!isLoggedIn()) {
            return unauthorized();
        }

        let newName = body as string;

        if (newName == "") {
            return error("Le champ n'est pas rempli.");
        }

        let user = users.find(user => user.id === idFromUrl());

        // Update and save user
        Object.assign(user, { name: newName });
        localStorage.setItem(usersKey, JSON.stringify(users));

        return ok(addToken(user));
    }

    function updatePassword() {
        if (!isLoggedIn()) {
            return unauthorized();
        }

        const { oldPassword, newPassword, confirmPassword } = body as any;
        let user = users.find(user => user.id === idFromUrl());

        if (oldPassword == "" || newPassword == "" || confirmPassword == "") {
            return error("L'un des champ n'est pas rempli.");
        }

        if (oldPassword !== user.password) {
            return error("L'ancien mot de passe est incorrect.");
        }

        if (newPassword !== confirmPassword) {
            return error("Le nouveau mot de passe et le mot de passe de confirmation doivent être identique.");
        }

        // Update and save user
        Object.assign(user, { password: newPassword });
        localStorage.setItem(usersKey, JSON.stringify(users));

        return ok(addToken(user));
    }

    function getSites() {
        if (!isLoggedIn()) {
            console.log("Not connected");
            return unauthorized();
        }
        
        let userId = idFromUrl();
        let userSites = sites.filter(site => site.userId === userId);

        return ok(userSites.map(s => s as Site));
    }
    
    function addSite() {
        if (!isLoggedIn()) {
            return unauthorized();
        }

        let site = body as Site;
        site.idSite = sites.length ? Math.max(...sites.map(s => s.id)) + 1 : 1;

        // update and save user
        sites.push(site);
        localStorage.setItem(sitesKey, JSON.stringify(sites));

        let userSites = sites.filter(s => s.idUser === site.idUser);

        return ok(userSites.map(s => s as Site));
    }

    function updateSite() {
        if (!isLoggedIn()) {
            return unauthorized();
        }

        let params = body as Site;
        let site = sites.find(s => s.id === params.idSite);

        // update and save user
        Object.assign(site, params);
        localStorage.setItem(sitesKey, JSON.stringify(sites));

        let userSites = sites.filter(s => s.idUser === site.idUser);

        return ok(userSites.map(s => s as Site));
    }

    function deleteSite() {
        if (!isLoggedIn()) {
            return unauthorized();
        }

        sites = sites.filter(s => s.id !== idFromUrl());
        localStorage.setItem(sitesKey, JSON.stringify(sites));

        return ok();
    }

    function openSite() {
        let siteId = body as number;
        let site = sites.find(s => s.id === siteId);

        if(!site)
            return error("Site not found");
        
        Object.assign(site, {toVisit: false, lastVisit: new Date(), nextDate: searchNextDate(site)});
        localStorage.setItem(sitesKey, JSON.stringify(sites));

        return ok();
    }

    // ==== Helper functions ====
    function ok(body?: any) {
        return of(new HttpResponse({ status: 200, body }))
            .pipe(delay(500)); // delay observable to simulate server api call
    }

    function error(message: string) {
        return throwError(() => ({ error: { message } }))
            .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    function unauthorized() {
        return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } }))
            .pipe(materialize(), delay(500), dematerialize());
    }

    function isLoggedIn() {
        return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }

    function idFromUrl() {
        const urlParts = url.split('/');
        return parseInt(urlParts[urlParts.length - 1]);
    }

    function addToken(user: User) {
        return {
            ...user,
            token: 'fake-jwt-token'
        };
    }

    function searchNextDate(site: Site) {
        let today = new Date();
		let newNextDate = site.nextDate;

		while(newNextDate < today)
		{
			switch(site.frequency)
			{
				case Frequency.Daily:
					newNextDate.setDate(newNextDate.getDate() + 1);
					break;
					
				case Frequency.Weekly:
					newNextDate.setDate(newNextDate.getDate() + 7);
					break;
					
				case Frequency.Monthly:
					newNextDate.setMonth(newNextDate.getMonth() + 1);
					break;
					
				default: // Annuel et autre
                    newNextDate.setFullYear(newNextDate.getFullYear() + 1);
					break;
			}
		}
		
		return newNextDate;
    }
};

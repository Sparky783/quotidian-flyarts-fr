import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Site } from '../_interfaces/site';

@Injectable({
    providedIn: 'root'
})
export class SiteService {
    private http: HttpClient = inject(HttpClient);

    getSites(userId: number) {
        return this.http.get<Site[]>(`${environment.apiUrl}/sites/` + userId, { withCredentials: true });
    }

    openSite(siteId: number) {
        return this.http.get<Site[]>(`${environment.apiUrl}/sites/open/` + siteId, { withCredentials: true });
    }

    add(site: Site) {
        return this.http.post<Site[]>(`${environment.apiUrl}/sites`, site, { withCredentials: true });
    }

    update(site: Site) {
        return this.http.put<Site[]>(`${environment.apiUrl}/sites/` + site.idSite, site, { withCredentials: true });
    }

    delete(siteId: number) {
        return this.http.delete(`${environment.apiUrl}/sites/${siteId}`, { withCredentials: true });
    }
}

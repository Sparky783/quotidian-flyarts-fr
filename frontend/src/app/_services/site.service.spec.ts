import { TestBed } from '@angular/core/testing';

import { SiteService } from './site.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SiteService', () => {
    let service: SiteService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ]
        });
        service = TestBed.inject(SiteService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

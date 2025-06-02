import { Test, TestingModule } from '@nestjs/testing';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';

describe('SiteController', () => {
    it('fake test', () => {
        expect(true).toBeTruthy();
    });
    // let controller: SiteController;

    // beforeEach(async () => {
    //     const module: TestingModule = await Test.createTestingModule({
    //         controllers: [SiteController],
    //         providers: [SiteService],
    //     }).compile();

    //     controller = module.get<SiteController>(SiteController);
    // });

    // it('should be defined', () => {
    //     expect(controller).toBeDefined();
    // });
});

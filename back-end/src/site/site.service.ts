import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Site } from './entities/site.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SiteService {
    constructor(
        @InjectRepository(Site)
        private sitesRepository: Repository<Site>,
    ) { }

    create(idUser: number, createSiteDto: CreateSiteDto) {
        // This action adds a new site
        const site = new Site();
        site.idUser = idUser;
        site.name = createSiteDto.name;
        site.url = createSiteDto.url;
        site.frequency = createSiteDto.frequency;
        site.nextDate = createSiteDto.nextDate;
        site.lastVisit = createSiteDto.lastVisit;

        return this.sitesRepository.save(site);
    }

    findAll(idUser: number) {
        // This action returns all site of #${idUser} user
        return this.sitesRepository.find({
            where: {
                idUser: idUser,
            }
        });
    }

    findOne(id: number) {
        // This action returns a #${id} site
        return this.sitesRepository.find({
            where: {
                idSite: id,
            }
        });
    }

    update(id: number, updateSiteDto: UpdateSiteDto) {
        // This action updates a #${id} site
        return this.sitesRepository.update(id, updateSiteDto);
    }

    remove(idSite: number, idUser: number) {
        // This action removes a #${id} site
        
        return this.sitesRepository.delete(idSite);
    }
}

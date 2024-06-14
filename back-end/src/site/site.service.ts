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
        site.nextDate = new Date(createSiteDto.nextDate);
        site.lastVisit = new Date(createSiteDto.lastVisit);

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

    async findOne(id: number) {
        // This action returns a #${id} site
        let sites = await this.sitesRepository.find({
            where: {
                idSite: id,
            }
        });

        return sites[0];
    }

    update(id: number, updateSiteDto: UpdateSiteDto) {
        // This action updates a #${id} site
        return this.sitesRepository.update(id, updateSiteDto);
    }

    remove(idSite: number, idUser: number) {
        // This action removes a #${id} site
        
        return this.sitesRepository.delete(idSite);
    }

    async open(id: number) {
        // This action returns a #${id} site
        let site = await this.findOne(id);
        let today = new Date();
        let nextDate = new Date(site.nextDate);

        if(!nextDate) {
            console.log("Error");
            return;
        }

		while (nextDate < today) {
            switch(site.frequency) {
                case "daily":
                    nextDate.setDate(nextDate.getDate() + 1);
                    break;
                    
                case "weekly":
                    nextDate.setDate(nextDate.getDate() + 7);
                    break;
                    
                case "monthly":
                    nextDate.setMonth(nextDate.getMonth() + 1);
                    break;
                    
                case "yearly":
                    nextDate.setFullYear(nextDate.getFullYear() + 1);
                    break;
            }
        }

        this.sitesRepository.update(id, {
            nextDate: nextDate,
            lastVisit: today
        });
    }
}

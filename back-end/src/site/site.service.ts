import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SiteService {
  create(createSiteDto: CreateSiteDto) {
    return 'This action adds a new site';
  }

  findAll(idUser: number) {
    return `This action returns all site of #${idUser} user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} site`;
  }

  update(id: number, updateSiteDto: UpdateSiteDto) {
    return `This action updates a #${id} site`;
  }

  remove(id: number) {
    return `This action removes a #${id} site`;
  }
}

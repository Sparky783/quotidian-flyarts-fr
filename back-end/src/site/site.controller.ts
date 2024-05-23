import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Controller('sites')
export class SiteController {
    constructor(private readonly siteService: SiteService) { }

    @Post()
    create(@Body() createSiteDto: CreateSiteDto) {
        return this.siteService.create(createSiteDto);
    }

    @Get(':idUser')
    findAll(@Param('idUser') idUser: number) {
        return this.siteService.findAll(+idUser);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.siteService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateSiteDto: UpdateSiteDto) {
        return this.siteService.update(+id, updateSiteDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.siteService.remove(+id);
    }
}

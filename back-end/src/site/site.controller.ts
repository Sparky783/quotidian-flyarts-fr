import { Controller, Get, Post, Body, Patch, Param, Delete, Session, Res, Req, Put } from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { User } from 'src/user/entities/user.entity';
import { Request, Response } from 'express';

@Controller('sites')
export class SiteController {
    constructor(private readonly siteService: SiteService) { }

    @Post()
    async create(
        @Req() request: Request,
        @Res() response: Response,
        @Body() createSiteDto: CreateSiteDto
    ) {
        if (!request.session['user']) {
            return response.status(401).json({ message: 'You need to be logged in.' });
        }

        const idUser = (request.session['user'] as User).idUser;
        await this.siteService.create(idUser, createSiteDto);

        const result = await this.siteService.findAll(idUser);
        return response.json(result);
    }

    @Get(':idUser')
    async findAll(
        @Req() request: Request,
        @Res() response: Response,
        @Param('idUser') idUser: number
    ) {
        if (!request.session['user']) {
            return response.status(401).json({ message: 'You need to be logged in.' });
        }

        const result = await this.siteService.findAll(idUser);
        return response.json(result);
    }

    @Get('open/:id')
    async findOne(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: number
    ) {
        if (!request.session['user']) {
            return response.status(401).json({ message: 'You need to be logged in.' });
        }

        await this.siteService.open(id);
        return response.json(true);
    }

    @Put(':id')
    async update(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: number, @Body() updateSiteDto: UpdateSiteDto
    ) {
        if (!request.session['user']) {
            return response.status(401).json({ message: 'You need to be logged in.' });
        }

        await this.siteService.update(+id, updateSiteDto);

        const idUser = (request.session['user'] as User).idUser;
        const result = await this.siteService.findAll(idUser);
        return response.json(result);
    }

    @Delete(':id')
    async remove(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: number
    ) {
        if (!request.session['user']) {
            return response.status(401).json({ message: 'You need to be logged in.' });
        }

        const result = await this.siteService.remove(+id, request.session['user'].idUser);
        return response.json(result);
    }
}

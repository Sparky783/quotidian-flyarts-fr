import { Controller, Get, Post, Body, Patch, Param, Delete, Session, Res, Req, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UserUtils } from './user.utils';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    create(
        @Req() request: Request,
        @Res() response: Response,
        @Body() createUserDto: CreateUserDto
    ) {
        if (!request.session['user']) {
            return response.status(401).json({ message: 'You need to be logged in.' });
        }

        if (!this.isAdminUser(request.session['user'])) {
            return response.status(403).json({ message: 'You need to be admin.' });
        }

        // Get the data from the req body
        let password = UserUtils.generatePassword();
        const saltRounds = 10;

        if (!password)
            return;

        // Hash a password
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err)
                throw err;

            createUserDto.password = hash;
            await this.userService.create(createUserDto);

            const result = await this.userService.findAll();
            return response.json(result);
        });
    }

    @Get()
    async findAll(
        @Req() request: Request,
        @Res() response: Response
    ) {
        if (!request.session['user']) {
            return response.status(401).json({ message: 'You need to be logged in.' });
        }

        if (!this.isAdminUser(request.session['user'])) {
            return response.status(403).json({ message: 'You need to be admin.' });
        }
        
        const result = await this.userService.findAll();
        return response.json(result);
    }

    @Get(':id')
    findOne(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: string
    ) {
        if (!request.session['user']) {
            return response.status(401).json({ message: 'You need to be logged in.' });
        }

        if (!this.isAdminUser(request.session['user'])) {
            return response.status(403).json({ message: 'You need to be admin.' });
        }

        return this.userService.findOne(+id);
    }

    @Put(':id')
    async update(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        if (!request.session['user']) {
            return response.status(401).json({ message: 'You need to be logged in.' });
        }

        if (!this.isAdminUser(request.session['user'])) {
            return response.status(403).json({ message: 'You need to be admin.' });
        }

        await this.userService.update(+id, updateUserDto);

        const result = await this.userService.findAll();
        return response.json(result);
    }

    @Delete(':id')
    async remove(
        @Req() request: Request,
        @Res() response: Response,
        @Param('id') id: string
    ) {
        if (!request.session['user']) {
            return response.status(401).json({ message: 'You need to be logged in.' });
        }

        if (!this.isAdminUser(request.session['user'])) {
            return response.status(403).json({ message: 'You need to be admin.' });
        }

        const result = await this.userService.remove(+id);
        return response.json(result);
    }

    @Post('login')
    async login(
        @Res() response: Response,
        @Body() loginUserDto: LoginUserDto,
        @Req() request: Request
    ) {
        if (!loginUserDto.email || !loginUserDto.password) {
            return 'Please enter Username and Password!';
        }

        const users = await this.userService.findByEmail(loginUserDto.email);

        if (users.length == 0) {
            return response.status(500).json({ message: 'User not found' });
        }

        if (users.length > 1) {
            return response.status(500).json({ message: 'An error occured' });
        }

        if (!await bcrypt.compareSync(loginUserDto.password, users[0].password)) {
            return response.status(401).json({ message: 'Incorrect Email and/or Password!' });
        }

        try {
            await new Promise<void>((resolve, reject) => {
                request.session.regenerate((err) => {
                    if (err)
                        return reject(err);

                    request.session['user'] = users[0];

                    request.session.save((err) => {
                        if (err)
                            return reject(err);

                        resolve();
                    });
                });
            });

            return response.send(request.session['user']);
        } catch (err) {
            console.error('Error during session regeneration or saving:', err);
            return response.status(500).json({ message: 'An error occurred during login.' });
        }
    }

    private isAdminUser(user: User): boolean {
        return user.status === "admin";
    }
}

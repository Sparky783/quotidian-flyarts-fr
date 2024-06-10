import { Controller, Get, Post, Body, Patch, Param, Delete, Session, Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // @Get('createpassword')
    // dqsdqs(@Res() response: Response) {
    //     // Get the data from the req body
    //     let password = "";
    //     const saltRounds = 10;

    //     if (!password)
    //         return;

    //     // Hash a password
    //     bcrypt.hash(password, saltRounds, (err, hash) => {
    //         if (err)
    //             throw err;

    //         return response.send(hash);
    //     });
    // }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
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
}

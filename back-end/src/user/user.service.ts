import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    create(createUserDto: CreateUserDto) {
        // This action adds a new user
        return this.usersRepository.create(createUserDto); // Type is maybe User instead of CreateUserDto;
    }

    findAll() {
        // This action returns all user
        return this.usersRepository.find();
    }

    findOne(idUser: number): Promise<User | null> {
        // This action returns a #${id} user
        return this.usersRepository.findOne({
            where: {
                idUser: idUser,
            }
        });
    }
    
    findByEmail(userEmail: string): Promise<User[]> {
        return this.usersRepository.find({
            where: {
                email: userEmail,
            }
        });
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        // This action updates a #${id} user
        return this.usersRepository.update(id, updateUserDto); 
    }

    async remove(id: number): Promise<void> {
        // This action removes a #${id} user
        await this.usersRepository.delete(id);
    }
}

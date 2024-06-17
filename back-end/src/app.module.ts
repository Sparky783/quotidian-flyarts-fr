import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SiteModule } from './site/site.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Site } from './site/entities/site.entity';

@Module({
    imports: [
        SiteModule,
        UserModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'flyarts_quotidian',
            entities: [
                User,
                Site
            ],
            //autoLoadEntities: true, // Remove "entities" content and anable it to allow TypeOrm to automaticaly find entities.
            synchronize: false, // Do not set to true in production. That re-write the tables structure.
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }

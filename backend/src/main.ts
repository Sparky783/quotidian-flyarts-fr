import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as dotenv from 'dotenv';

// Charger le fichier .env approprié en fonction de NODE_ENV
const environment = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${environment}` });

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: process.env.CORSORIGIN,
        credentials: true,
    });

    let sess = {
        secret: 'quoidian-keyboard-cat',
        resave: false,
        saveUninitialized: false, // Utilisez false pour ne pas sauvegarder les sessions non initialisées
        cookie: {
            secure: false, // mettre à true si vous utilisez HTTPS
            httpOnly: true,
            maxAge: 86400000 // 24 heures
        }
    };
    
    app.use(session(sess));
    
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
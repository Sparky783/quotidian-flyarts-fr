import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: 'http://localhost:4200',
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
    
    // if (app.get('env') === 'production') {
    //     app.set('trust proxy', 1) // trust first proxy
    //     sess.cookie.secure = true // serve secure cookies
    // }
    
    app.use(session(sess));
    
    await app.listen(3000);
}
bootstrap();
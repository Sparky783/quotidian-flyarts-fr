import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserUtils {
    static generatePassword(nbChar: number = 16) {
        if (nbChar <= 0) {
			return null;
		}

		let pass = '';
		let chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
						'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
						'0','1','2','3','4','5','6','7','8','9',
						'!','?','#','-','_'];

		for (let i = 0; i < nbChar; i ++) {
			pass += chars[this.getRandomInt(chars.length)];
		}

		return pass;
    }

    private static getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
}

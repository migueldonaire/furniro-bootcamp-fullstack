import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UsersService} from '../users/users.service';

@Injectable()
export class AuthService {
constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
) {}

async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    const PasswordOk = user ? await verify(user.password_hash, password) : false;
    if (!user || !PasswordOk) {
        throw new UnauthorizedException('Credenciales inválidas');
    }   
    if (user.status === 'PENDING') {
        throw new UnauthorizedException('Confirma tu email antes de entrar');
    }
    if (user.status === 'INACTIVE') {
        throw new UnauthorizedException('Tu cuenta está desactivada. Contacta al email de soporte para más información: furnirobootcampfullstack@gmail.com');
    } 
    
    const payload = {sub: user.id, email: user.email, role: user.role};
    const accessToken = this.jwtService.sign(payload, {expiresIn: '15m'});

    return {accessToken};
    }
}


function verify(password_hash: any, password: string) {
    throw new Error('Function not implemented.');
}


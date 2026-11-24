import {Controller, Post, Body, Throttle} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginDto} from './login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @Throttle(5, 60) 
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }
}
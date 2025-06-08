import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './auth';

@Controller('auth')
export class AuthController {
   
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authUserDto: AuthUserDto) {
    console.log("authUserDto",authUserDto)
    return this.authService.login(authUserDto);
  }

}

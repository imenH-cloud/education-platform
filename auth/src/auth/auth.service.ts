import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto } from './dto/auth-user.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
          console.log('gg!!!!!!!!!!!!!!!!!!!',email)

    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3002/user/email/${email}`)
      );
      console.log('response',response)
      const user = response.data;

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      return user;
    } catch (error) {
      throw new NotFoundException('Email et/ou mot de passe sont incorrects');
    }
  }

  async login(user: AuthUserDto) {
    const userData = await this.validateUser(user.email, user.password);

    const passwordMatches = await bcrypt.compare(user.password, userData.password);
    // if (!passwordMatches) {
    //   throw new UnauthorizedException('Email et/ou mot de passe sont incorrects');
    // }

    const payload = {
      id: userData.id,
      email: userData.email,
    };

    const expiresIn = user.rememberMe ? 24 * 60 * 60 : 2 * 60 * 60; // en secondes

    return {
      idUser: userData.id,
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn,
      }),
    };
  }
}

/* eslint-disable */
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto } from './dto/auth-user.dto';
import { jwtConstants } from './constants';
import { UserService } from 'src/user/service/user.service';
import { User } from 'src/user/entities/user.entity';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user) {
      const isPasswordMatching = await bcrypt.compare(pass, user.password);
      if (isPasswordMatching) {
        const { token, saltRounds, password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: AuthUserDto) {
    const userlogin: User = await this.validateUser(
      user.email,
      user.password,
    );
    if (userlogin) {
      const idUser = userlogin.id;
      const payload = {
        id: idUser,
        email: userlogin.email
      };
      const expiresIn =  user.rememberMe == true  ? 24*60*60 :	2*60*60

      return {
        idUser: idUser,
        access_token: this.jwtService.sign(payload, {
          secret: jwtConstants.secret,
          expiresIn: expiresIn,
        }),
        expiresIn: expiresIn,
        firstName: userlogin.firstName,
        lastName: userlogin.lastName,
      
      };
    } else {
      throw new NotFoundException(`Email et/ou mot de passe sont incorrects`);
    }
  }
}

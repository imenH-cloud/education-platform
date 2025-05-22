import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  find():any {
    return this.userService.findUsers();
  }

  @Post('/')
  async createUser(@Body() userDto: CreateUserDto,) {
    return this.userService.createUser(userDto);
  }
  
  @Patch('/:id')
  async replaceById(@Param('id') id: number, @Body() userDto: UpdateUserDto,) {
    return this.userService.replaceById(id, userDto);
  }

  @Get('/:id')
  findById(@Param('id') id: number) {
    return this.userService.findById(id);
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }

  @Post('/deleteMultipleUser')
  removeMultiple(@Body() tab: any) {
    return this.userService.removeMultiple(tab);
  }
}

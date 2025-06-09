import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [{ id: 1, name: 'Imen' }];

  findAll() {
    return this.users;
  }

  findById(id: number) {
    return this.users.find(user => user.id === id);
  }
}


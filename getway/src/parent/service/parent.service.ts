import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateParentDto } from '../dto/update-parent.dto';
import { CreateParentDto } from '../dto/create-parent.dto';
@Injectable()
export class ParentService {
  create(createParentDto: CreateParentDto) {
    return 'This action adds a new parent';
  }

  findAll() {
    return `This action returns all parent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parent`;
  }

  update(id: number, updateParentDto: UpdateParentDto) {
    return `This action updates a #${id} parent`;
  }

  remove(id: number) {
    return `This action removes a #${id} parent`;
  }
}

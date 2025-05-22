import { Module } from '@nestjs/common';
import { ParentController } from './controller/parent.controller';
import { ParentService } from './service/parent.service';

@Module({
  controllers: [ParentController],
  providers: [ParentService],
})
export class ParentModule {}

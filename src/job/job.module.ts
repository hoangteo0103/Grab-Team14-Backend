import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { TypeFilters } from 'src/filter/filter.constant';
import { FilterModule } from 'src/filter/filter.module';

@Module({
  controllers: [JobController],
  providers: [JobService],
  imports: [FilterModule],
})
export class JobModule {}

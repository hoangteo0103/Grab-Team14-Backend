import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { FilterModule } from 'src/filter/filter.module';
import JobsSearchService from './jobSearch.service';
import { Job, JobSchema } from './schemas/job.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchModule } from 'src/search/search.module';
import { JobRepository } from './repositories/job.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    FilterModule,
    SearchModule,
  ],
  controllers: [JobController],
  exports: [JobService, JobRepository],

  providers: [JobService, JobsSearchService, JobRepository],
})
export class JobModule {}

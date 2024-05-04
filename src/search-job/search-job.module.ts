import { Module } from '@nestjs/common';
import { SearchJobController } from './search-job.controller';
import { SearchJobService } from './search-job.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema } from './entity/job.entity';
import { JobRepository } from './repository/job.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }])],
  controllers: [SearchJobController],
  providers: [SearchJobService, JobRepository],
  exports: [SearchJobService],
})
export class SearchJobModule {}

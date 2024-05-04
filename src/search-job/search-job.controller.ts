import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { SearchJobService } from './search-job.service';
import { UserJobSearchRequestDTO } from './dto/user-job-search-request';

@Controller('search-jobs')
export class SearchJobController {
  jobRepository: any;
  constructor(private readonly searchJobService: SearchJobService) {}

  @Post()
  async searchJobs(@Body() jobSearchRequest: UserJobSearchRequestDTO) {
    console.log(`Received request for search-jobs with parameters: ${JSON.stringify(jobSearchRequest)}`);
    return await this.searchJobService.searchJobs(jobSearchRequest);
  }

  @Get(':jobId')
  async searchJobById(@Param('jobId') jobId: string): Promise<any> {
    const job = await this.jobRepository.findOne(jobId);
    if (!job) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }
    return job;
  }

  @Post('by-ids')
  async searchJobsByIds(@Body('jobIds') jobIds: string[]): Promise<any> {
    const jobs = await this.searchJobService.searchJobsByIds(jobIds);
    if (jobs.length === 0) {
      throw new HttpException('Jobs not found', HttpStatus.NOT_FOUND);
    }
    return jobs;
  }
}

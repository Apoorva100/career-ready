import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from '../entity/job.entity';
import { UserJobSearchRequestDTO } from '../dto/user-job-search-request';
import { JobExperienceTypes } from '../dto/jsearch-api-request';

@Injectable()
export class JobRepository {
  private readonly logger = new Logger(JobRepository.name);
  constructor(
    @InjectModel('Job')
    private readonly jobModel: Model<Job>,
  ) {}

  async findOne(jobId: string): Promise<Job> {
    return await this.jobModel.findOne({ job_id: jobId });
  }

  // async findMany(jobSearchRequest: UserJobSearchRequestDTO): Promise<Job[]> {
  //   const {
  //     page,
  //     radius,
  //     location_coordinates,
  //     job_title,
  //     employment_types,
  //     remote_jobs_only,
  //     job_experience_types,
  //   } = jobSearchRequest;
  //   const pageSize = 10;
  //   const skip = (page - 1) * pageSize;

  //   let pipeline = [];

  //   // Full-text search
  //   if (job_title) {
  //     pipeline.push({
  //       $match: {
  //         $text: { $search: job_title },
  //       },
  //     });
  //   }

  //   const additionalFilters: any = {};
  //   // Additional filtering
  //   if (employment_types) {
  //     additionalFilters.job_employment_type = employment_types;
  //   }
  //   if (typeof remote_jobs_only !== 'undefined') {
  //     additionalFilters.job_is_remote = remote_jobs_only;
  //   }
  //   // Job experience types filtering
  //   switch (job_experience_types) {
  //     case JobExperienceTypes.no_experience:
  //       additionalFilters['job_required_experience.no_experience_required'] =
  //         true;
  //       break;
  //     case JobExperienceTypes.under_3_years_experience:
  //       additionalFilters[
  //         'job_required_experience.required_experience_in_months'
  //       ] = { $lte: 36 };
  //       break;
  //     case JobExperienceTypes.more_than_3_years_experience:
  //       additionalFilters[
  //         'job_required_experience.required_experience_in_months'
  //       ] = { $gt: 36 };
  //       break;
  //   }
  //   if (Object.keys(additionalFilters).length > 0) {
  //     pipeline.push({ $match: additionalFilters });
  //   }
  //   // Geospatial filtering
  //   if (location_coordinates && location_coordinates.coordinates && radius) {
  //     pipeline.push({
  //       $match: {
  //         location: {
  //           $geoWithin: {
  //             $centerSphere: [
  //               location_coordinates.coordinates,
  //               radius / 6378.1, // radius in radians; Earth's radius in km
  //             ],
  //           },
  //         },
  //       },
  //     });
  //   }

  //   // Pagination and sorting
  //   pipeline.push({ $skip: skip });
  //   pipeline.push({ $limit: pageSize });
  //   pipeline.push({ $sort: { job_posted_at_timestamp: -1 } });

  //   // Execute the pipeline and return the results
  //   const jobs = await this.jobModel.aggregate(pipeline);
  //   return jobs;
  // }

  async findMany(jobSearchRequest: UserJobSearchRequestDTO): Promise<Job[]> {
    const {
      page,
      radius,
      location_coordinates,
      job_title,
      employment_types,
      remote_jobs_only,
      job_experience_types,
    } = jobSearchRequest;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    let pipeline = [];

    // Regex search for job title
    if (job_title) {
      const words = job_title.split(/\s+/);
      const regexPattern = words.map((word) => `(?=.*\\b${word}\\b)`).join('');
      const regex = new RegExp(regexPattern, 'i'); // 'i' for case-insensitive matching

      pipeline.push({
        $match: {
          job_title: { 
            $regex: regex,
          },
        },
      });
    }

    const additionalFilters: any = {};
    // Additional filtering
    if (employment_types) {
      additionalFilters.job_employment_type = employment_types;
    }
    if (typeof remote_jobs_only !== 'undefined') {
      additionalFilters.job_is_remote = remote_jobs_only;
    }
    // Job experience types filtering
    switch (job_experience_types) {
      case JobExperienceTypes.no_experience:
        additionalFilters['job_required_experience.no_experience_required'] =
          true;
        break;
      case JobExperienceTypes.under_3_years_experience:
        additionalFilters[
          'job_required_experience.required_experience_in_months'
        ] = { $lte: 36 };
        break;
      case JobExperienceTypes.more_than_3_years_experience:
        additionalFilters[
          'job_required_experience.required_experience_in_months'
        ] = { $gt: 36 };
        break;
    }
    if (Object.keys(additionalFilters).length > 0) {
      pipeline.push({ $match: additionalFilters });
    }
    // Geospatial filtering
    if (location_coordinates && location_coordinates.coordinates && radius) {
      pipeline.push({
        $match: {
          location: {
            $geoWithin: {
              $centerSphere: [
                location_coordinates.coordinates,
                radius / 6378.1, // radius in radians; Earth's radius in km
              ],
            },
          },
        },
      });
    }

    // Pagination and sorting
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: pageSize });
    pipeline.push({ $sort: { job_posted_at_timestamp: -1 } });

    // Execute the pipeline and return the results
    const jobs = await this.jobModel.aggregate(pipeline);
    return jobs;
  }

  async createMany(jobs: Job[]) {
    try {
      await this.jobModel.insertMany(jobs, { ordered: false });
    } catch (error) {
      if (error.code === 11000) {
        // Handle duplicate key error specifically
        this.logger.warn(
          'Duplicate job insertion attempt detected and skipped.',
        );
      } else {
        // Rethrow or handle other types of errors
        throw error;
      }
    }
  }
  async findByIds(jobIds: string[]): Promise<Job[]> {
    return this.jobModel.find({ 'job_id': { $in: jobIds } }).exec();
  }
}

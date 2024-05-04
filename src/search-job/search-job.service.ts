import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { JobDto } from './dto/job-search-response';
import { JobRepository } from './repository/job.repository';
import { UserJobSearchRequestDTO } from './dto/user-job-search-request';
import { Job } from './entity/job.entity';
import { JSearchAPIRequestDTO } from './dto/jsearch-api-request';
import * as dotenv from 'dotenv';

@Injectable()
export class SearchJobService {
  private rapidApiKey = '';
  private readonly logger = new Logger(SearchJobService.name);

  constructor(private readonly jobRepository: JobRepository) {
    dotenv.config();
    this.rapidApiKey = process.env.RAPIDAPI_KEY;
  }

  async searchJobs(jobSearchRequest: UserJobSearchRequestDTO): Promise<any[]> {
    let jobsFromDB = await this.searchJobsInDB(jobSearchRequest);

    this.logger.debug(`Found ${jobsFromDB.length} jobs from the database.`);

    if (jobsFromDB.length < 10) {
      const apiRequestDto: JSearchAPIRequestDTO = {
        query: `${jobSearchRequest.job_title} in ${jobSearchRequest.location_city}, ${jobSearchRequest.location_state}`,
        page: jobSearchRequest.page,
        job_experience_types: jobSearchRequest.job_experience_types,
        employment_types: jobSearchRequest.employment_types,
        remote_jobs_only: jobSearchRequest.remote_jobs_only,
        radius: jobSearchRequest.radius,
      };

      const jobsFromAPI = await this.searchJobsFromAPI(apiRequestDto);

      // Filter out duplicates based on job_id
      const uniqueJobsFromAPI = jobsFromAPI.filter(
        (job) => !jobsFromDB.some((dbJob) => dbJob.job_id === job.job_id),
      );

      this.logger.debug(
        `Found ${uniqueJobsFromAPI.length} unique jobs from the API.`,
      );

      // Insert unique jobs from API into DB
      if (uniqueJobsFromAPI.length > 0) {
        await this.jobRepository.createMany(uniqueJobsFromAPI);
        jobsFromDB = [...jobsFromDB, ...uniqueJobsFromAPI];
      }
    }

    return jobsFromDB.map((job) => this.mapJobDataToSwiftStructFormat(job));
  }

  mapJobDataToSwiftStructFormat(job: Job): any {
    return {
      id: job.job_id,
      employerName: job.employer_name,
      employerLogo: job.employer_logo,
      employerWebsite: job.employer_website,
      employerCompanyType: job.employer_company_type,
      jobEmploymentType: job.job_employment_type,
      jobTitle: job.job_title,
      jobApplyLink: job.job_apply_link,
      jobDescription: job.job_description,
      jobIsRemote: job.job_is_remote,
      jobPostedAtTimestamp: job.job_posted_at_timestamp,
      jobPostedAtDatetimeUtc: job.job_posted_at_datetime_utc,
      jobCity: job.job_city,
      jobState: job.job_state,
      jobCountry: job.job_country,
      jobLatitude: job.location?.coordinates[1],
      jobLongitude: job.location?.coordinates[0],
      jobRequiredExperience: {
        noExperienceRequired:
          job.job_required_experience.no_experience_required,
        requiredExperienceInMonths:
          job.job_required_experience.required_experience_in_months,
        experienceMentioned: job.job_required_experience.experience_mentioned,
        experiencePreferred: job.job_required_experience.experience_preferred,
      },
      jobMinSalary: job.job_min_salary,
      jobMaxSalary: job.job_max_salary,
      jobSalaryCurrency: job.job_salary_currency,
      jobSalaryPeriod: job.job_salary_period,
      jobHighlights: {
        qualifications: job.job_highlights.qualifications,
        responsibilities: job.job_highlights.responsibilities,
      },
    };
  }

  async searchJobsInDB(jobSearchRequest: UserJobSearchRequestDTO) {
    return await this.jobRepository.findMany(jobSearchRequest);
  }

  async searchJobsByIds(jobIds: string[]): Promise<Job[]> {
    const jobs = await this.jobRepository.findByIds(jobIds);
    return jobs.map(job => this.mapJobDataToSwiftStructFormat(job));
  }

  async searchJobsFromAPI(requestDto: JSearchAPIRequestDTO): Promise<Job[]> {
    const {
      query,
      page = '1',
      job_experience_types,
      employment_types,
      remote_jobs_only,
      radius,
    } = requestDto;

    const params: any = {
      query,
      page,
      num_pages: '1',
      exclude_job_publishers: 'BeeBe,Dice',
    };

    if (job_experience_types) {
      params.job_requirements = job_experience_types;
    }
    if (employment_types) {
      params.employment_types = employment_types;
    }
    if (typeof remote_jobs_only !== 'undefined') {
      params.remote_jobs_only = remote_jobs_only;
    }
    if (radius) {
      params.radius = radius.toString();
    }

    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: params,
      headers: {
        'X-RapidAPI-Key': this.rapidApiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const responseData: JobDto[] = response.data.data;

      const jobsDataFromAPI: Job[] = responseData.map((jobDto) => ({
        job_id: jobDto.job_id,
        employer_name: jobDto.employer_name,
        employer_logo: jobDto.employer_logo,
        employer_website: jobDto.employer_website,
        employer_company_type: jobDto.employer_company_type,
        job_employment_type: jobDto.job_employment_type,
        job_title: jobDto.job_title,
        job_apply_link: jobDto.job_apply_link,
        job_description: jobDto.job_description,
        job_is_remote: jobDto.job_is_remote,
        job_posted_at_timestamp: jobDto.job_posted_at_timestamp,
        job_posted_at_datetime_utc: jobDto.job_posted_at_datetime_utc,
        job_city: jobDto.job_city,
        job_state: jobDto.job_state,
        job_country: jobDto.job_country,
        location:
          jobDto.job_latitude !== null && jobDto.job_longitude !== null
            ? {
                type: 'Point',
                coordinates: [jobDto.job_longitude, jobDto.job_latitude],
              }
            : undefined,
        job_required_experience: {
          no_experience_required:
            jobDto.job_required_experience.no_experience_required,
          required_experience_in_months:
            jobDto.job_required_experience.required_experience_in_months,
          experience_mentioned:
            jobDto.job_required_experience.experience_mentioned,
          experience_preferred:
            jobDto.job_required_experience.experience_preferred,
        },
        job_required_skills: jobDto.job_required_skills,
        job_min_salary: jobDto.job_min_salary,
        job_max_salary: jobDto.job_max_salary,
        job_salary_currency: jobDto.job_salary_currency,
        job_salary_period: jobDto.job_salary_period,
        job_highlights: jobDto.job_highlights
          ? {
              qualifications: jobDto.job_highlights.Qualifications || [],
              responsibilities: jobDto.job_highlights.Responsibilities || [],
            }
          : { qualifications: [], responsibilities: [] },
      }));
      return jobsDataFromAPI;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch jobs from external API');
    }
  }
}

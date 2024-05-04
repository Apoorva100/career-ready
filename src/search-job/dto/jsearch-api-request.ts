import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export enum JobExperienceTypes {
  under_3_years_experience = 'under_3_years_experience',
  more_than_3_years_experience = 'more_than_3_years_experience',
  no_experience = 'no_experience',
}

enum EmploymentTypes {
  FULLTIME = 'FULLTIME',
  CONTRACTOR = 'CONTRACTOR',
  PARTTIME = 'PARTTIME',
  INTERN = 'INTERN',
}

export class JSearchAPIRequestDTO {
  @IsString()
  query: string;

  @IsBoolean()
  @IsOptional()
  remote_jobs_only: boolean;

  @IsEnum(EmploymentTypes)
  @IsOptional()
  employment_types: string;

  @IsEnum(JobExperienceTypes)
  @IsOptional()
  job_experience_types: string;

  @IsInt()
  @IsOptional()
  radius: number;

  @IsInt()
  @IsOptional()
  page: number;
}

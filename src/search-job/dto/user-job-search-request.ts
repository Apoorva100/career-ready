import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

enum JobExperienceTypes {
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

class LocationCoordinates {
  @IsArray()
  @Type(() => Number)
  coordinates: number[]; // [latitude, longitude]
}

export class UserJobSearchRequestDTO {
  @IsString()
  @IsNotEmpty()
  location_city: string;

  @IsString()
  @IsNotEmpty()
  location_state: string;

  @ValidateNested()
  @Type(() => LocationCoordinates)
  location_coordinates: LocationCoordinates;

  @IsBoolean()
  @IsOptional()
  remote_jobs_only: boolean;

  @IsEnum(EmploymentTypes)
  @IsOptional()
  employment_types: EmploymentTypes;

  @IsEnum(JobExperienceTypes)
  @IsOptional()
  job_experience_types: JobExperienceTypes;

  @IsString()
  @IsOptional()
  job_title: string;

  @IsInt()
  @IsOptional()
  radius: number;

  @IsInt()
  page: number;
}

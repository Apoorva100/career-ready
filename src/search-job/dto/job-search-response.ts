export class JobDto {
  job_id: string;
  employer_name: string | null;
  employer_logo: string | null;
  employer_website: string | null;
  employer_company_type: string | null;
  job_employment_type: string | null;
  job_title: string | null;
  job_apply_link: string;
  job_description: string;
  job_is_remote: boolean;
  job_posted_at_timestamp: number | null;
  job_posted_at_datetime_utc: string | null;
  job_city: string | null;
  job_state: string | null;
  job_country: string | null;
  job_latitude: number | null;
  job_longitude: number | null;
  job_required_experience: JobExperienceDto;
  job_required_skills: string | null;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_currency: string | null;
  job_salary_period: string | null;
  job_highlights: JobHighlightsDto;
}

export class JobExperienceDto {
  no_experience_required: boolean;
  required_experience_in_months: number | null;
  experience_mentioned: boolean;
  experience_preferred: boolean;
}

export class JobHighlightsDto {
  Qualifications: Array<string>;
  Responsibilities: Array<string>;
}

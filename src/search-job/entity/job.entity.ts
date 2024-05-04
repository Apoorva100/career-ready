import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class JobExperience {
  @Prop({ type: Boolean, required: false })
  no_experience_required: boolean;
  @Prop({ type: Number, required: false,  })
  required_experience_in_months: number;
  @Prop({ type: Boolean, required: false })
  experience_mentioned: boolean;
  @Prop({ type: Boolean, required: false })
  experience_preferred: boolean;
}
export type JobExperienceDocument = JobExperience & Document;
export const JobExperienceSchema = SchemaFactory.createForClass(JobExperience);

@Schema({ _id: false })
export class JobHighlights {
  @Prop({ type: [String], required: false })
  qualifications: Array<string>;
  @Prop({ type: [String], required: false })
  responsibilities: Array<string>;
}

export type JobHighlightsDocument = JobHighlights & Document;
export const JobHighlightsSchema = SchemaFactory.createForClass(JobHighlights);

@Schema()
export class Job {
  @Prop({ unique: true, required: true, type: String })
  job_id: string;
  @Prop({ type: String, required: false })
  employer_name: string;
  @Prop({ type: String, required: false })
  employer_logo: string;
  @Prop({ type: String, required: false })
  employer_website: string;
  @Prop({ type: String, required: false })
  employer_company_type: string;
  @Prop({ type: String, required: false })
  job_employment_type: string;
  @Prop({ type: String, required: false })
  job_title: string;
  @Prop({ type: String, required: false })
  job_apply_link: string;
  @Prop({ type: String, required: false })
  job_description: string;
  @Prop({ type: Boolean, required: false })
  job_is_remote: boolean;
  @Prop({ type: Number, required: false })
  job_posted_at_timestamp: number;
  @Prop({ type: String, required: false })
  job_posted_at_datetime_utc: string;
  @Prop({ type: String, required: false })
  job_city: string;
  @Prop({ type: String, required: false })
  job_state: string;
  @Prop({ type: String, required: false })
  job_country: string;
  @Prop({ type: JobExperience, required: false })
  job_required_experience: JobExperience;
  @Prop({ type: String, required: false })
  job_required_skills: string;
  @Prop({ type: Number, required: false })
  job_min_salary: number;
  @Prop({ type: Number, required: false })
  job_max_salary: number;
  @Prop({ type: String, required: false })
  job_salary_currency: string;
  @Prop({ type: String, required: false })
  job_salary_period: string;
  @Prop({ type: JobHighlights, required: false })
  job_highlights: JobHighlights;
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  })
  location: {
    type: string;
    coordinates: number[];
  };
}

export type JobDocument = Job & Document;
export const JobSchema = SchemaFactory.createForClass(Job);
JobSchema.index({ createdAt: 1 }, { expireAfterSeconds: 172800 }); // 172800 seconds = 2 days

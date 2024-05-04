import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';

@Schema({ _id: false, versionKey: false })
export class Education {
  @Prop({ type: String, default: '' })
  degree: string;
  @Prop({ type: String, default: '' })
  university: string;
  @Prop({ type: String, default: '' })
  graduationYear: string;
}

export type EducationDocument = Education & Document;
export const EducationSchema = SchemaFactory.createForClass(Education);

@Schema({ _id: false, versionKey: false })
export class ProfessionalSummary {
  @Prop({ type: String, default: '' })
  companyName: string;
  @Prop({ type: String, default: '' })
  role: string;
  @Prop({ type: [String], default: [] })
  skills: Array<string>;
  @Prop({ type: String, default: '' })
  durationInMonths: string;
}

export type ProfessionalSummaryDocument = ProfessionalSummary & Document;
export const ProfessionalSummarySchema =
  SchemaFactory.createForClass(ProfessionalSummary);

@Schema({ _id: false, versionKey: false })
export class Project {
  @Prop({ type: String, default: '' })
  title: string;
  @Prop({ type: String, default: '' })
  description: string;
  @Prop({ type: [String], default: [] })
  skills: Array<string>;
}

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);

@Schema({ _id: false, versionKey: false })
export class Question {
  @Prop({ type: String, default: '' })
  question: string;
  @Prop({ type: String, default: '' })
  sampleAnswer: string;
}

export type QuestionDocument = Question & Document;
export const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema({ timestamps: true, versionKey: false })
export class Resume {
  @Prop({ required: true, default: () => randomUUID(), unique: true })
  uuid: string;
  @Prop({ required: true, unique: true, type: String })
  user: string;
  @Prop({ type: String, default: '' })
  firstName: string;
  @Prop({ type: String, default: '' })
  lastName: string;
  @Prop({ type: String, default: '' })
  emailID: string;
  @Prop({ type: String, default: '' })
  github: string;
  @Prop({ type: String, default: '' })
  linkedin: string;
  @Prop({ type: [String], default: [] })
  skills: Array<String>;
  @Prop({ type: [Education], default: [] })
  education: Array<Education>;
  @Prop({ type: [ProfessionalSummary], default: [] })
  professionalSummary: Array<ProfessionalSummary>;
  @Prop({ type: [Project], default: [] })
  projects: Array<Project>;
  @Prop({ type: [String], default: [] })
  keyWordsToSearchForJobs: Array<string>;
  @Prop({ type: [String], default: [] })
  discoveryKeywords: Array<string>;
  @Prop({ type: [Question], default: [] })
  interviewPrepQuestions: Array<Question>;
}

export type ResumeDocument = Resume & Document;
export const ResumeSchema = SchemaFactory.createForClass(Resume);

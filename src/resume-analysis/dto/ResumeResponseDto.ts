import { Education } from '../entities/resume.entity';
import { QuestionDto } from './CreateResumeDTO';

export class ProfessionalSummaryResponse {
  companyName: string;
  role: string;
  durationInMonths: string;
}

export class ProjectResponse {
  title: string;
  description: string;
}

export class ResumeResponseDto {
  github: string;
  linkedin: string;
  keyWordsToSearchForJobs: Array<string>;
  professionalSummary: ProfessionalSummaryResponse[];
  education: Education[];
  projects: ProjectResponse[];
  interviewPrepQuestions: QuestionDto[];
  discoveryKeywords: Array<string>;
}

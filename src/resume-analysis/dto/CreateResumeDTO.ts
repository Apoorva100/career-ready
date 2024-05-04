export class CreateResumeDto {
  firstName: string = '';
  lastName: string = '';
  emailID: string = '';
  user: string = '';
  github: string = '';
  linkedin: string = '';
  skills: [''];
  education: EducationDto[] = [];
  professionalSummary: ProfessionalSummary[] = [];
  projects: ProjectDto[] = [];
  keyWordsToSearchForJobs: string[] = [];
  discoveryKeywords: string[] = [];
  interviewPrepQuestions: QuestionDto[] = [];
}

export class EducationDto {
  degree: string = '';
  university: string = '';
  graduationYear: string = '';
}

export class ProfessionalSummary {
  companyName: string = '';
  role: string = '';
  skills: string[] = [];
  durationInMonths: string = '';
}

export class QuestionDto {
  question: string = '';
  sampleAnswer: string = '';
}

export class ProjectDto {
  title: string = '';
  description: string = '';
  skills: string[] = [];
}

export const modelResumeTemplate = {
  firstName: '',
  lastName: '',
  emailID: '',
  github: '',
  linkedin: '',
  skills: [''],
  education: [
    {
      degree: '',
      university: '',
      graduationYear: '',
    },
  ],
  professionalSummary: [
    {
      companyName: '',
      role: '',
      skills: [''],
      durationInMonths: '',
    },
  ],
  projects: [
    {
      title: '',
      description: '',
      skills: [''],
    },
  ],
  keyWordsToSearchForJobs: [],
  discoveryKeywords: [
    'keyword1',
    'keyword2',
    'keyword3',
    'keyword4',
    'keyword5',
  ],
  interviewPrepQuestions: [
    {
      question: '',
      sampleAnswer: '',
    },
  ],
};

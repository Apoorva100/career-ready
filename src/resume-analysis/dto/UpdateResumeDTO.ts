import { ProfessionalSummaryResponse } from "./ResumeResponseDto";

export class UpdateProfessionalSummaryDTO {
  professionalSummary: Array<ProfessionalSummaryResponse>;
  user: string;
}

export class UpdateProjectDTO {
  title: string;
  description: string;
}

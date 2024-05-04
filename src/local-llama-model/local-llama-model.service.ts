import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError,map } from 'rxjs/operators';
import { AxiosError } from 'axios';
import { modelResumeTemplate } from 'src/resume-analysis/dto/CreateResumeDTO';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class LocalLlamaModelService {
    private readonly logger = new Logger(LocalLlamaModelService.name);
    constructor(private httpService: HttpService) {}

  async extractInfo(resumeText: string): Promise<any> {
    const jsonSchema = modelResumeTemplate;

    const payload = {
      model: 'llama3',
      messages: [
        { role: 'user', content: resumeText },
        { role: 'system', content: JSON.stringify(jsonSchema) },
        { role: 'system', content: `Analyze the attached resume to extract detailed information about the candidate's professional experience, skills, projects, and education. Carefully note the following:

        - 'professionalSummary': Highlight roles, companies, and duration in months, emphasizing the development and application of skills in each role.
        - 'skills': List all technical skills.
        - 'projects': Extract the title, description, skills used or developed, and duration in months for each project.
        - 'education': Detail degrees, institutions, and graduation years.
        
        Please organize this information into the specified JSON structure. Ensure each section is complete and adheres to the following requirements:
        - 'keyWordsToSearchForJobs': Include exactly 5 keywords tailored for job search engines.
        - 'discoveryKeywords': Include exactly 5 keywords for discovering industry insights.
        - 'interviewPrepQuestions': Provide exactly 5 potential interview questions with sample answers, related to the professional experiences, skills, and projects listed. These questions should prepare the candidate for potential interview scenarios based on their specific experiences and skills.
  
        It is crucial that each list contains exactly five entries and that all information is presented in a precise and structured format as specified.
        `  }
      ]
    };

    return this.httpService.post('http://localhost:11434/api/chat', payload).pipe(
      map(response => {
        // Check the structure of response if it's not directly response.data
        this.logger.log("Received raw response from model server: " + JSON.stringify(response.data));
        this.logger.log("Processing response from model server.");
        const jsonStr = response.data.split('```')[1];
        return JSON.parse(jsonStr);
      }),
      catchError((error: AxiosError) => {
        this.logger.error("Failed to process the model server response", error.message);
        return throwError(() => new Error("Error processing request"));
      })
    ).toPromise();
  }
}

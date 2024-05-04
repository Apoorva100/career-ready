import {
  Injectable,
  HttpServer,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GoogleGenerativeAiService } from '../google-generative-ai/google-generative-ai.service';
import {
  CreateResumeDto,
  ProfessionalSummary,
  modelResumeTemplate,
} from 'src/resume-analysis/dto/CreateResumeDTO';
import { plainToInstance } from 'class-transformer';
import { Resume } from './entities/resume.entity';
import { ResumeAnalysisRepository } from './repository/resume-analysis.repository';
import ResumeRequestDto from './dto/resumeRequestDto';
import { ResumeResponseDto } from './dto/ResumeResponseDto';
import { UpdateProfessionalSummaryDTO } from './dto/UpdateResumeDTO';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

@Injectable()
export class ResumeAnalysisService {
  constructor(
    private httpService: HttpService,
    private genAIService: GoogleGenerativeAiService,
    private resumeAnalysisRepository: ResumeAnalysisRepository,
  ) {}

  async extractKeywords(description: string): Promise<any> {
    let keywords_json_schema = {
      keywords: [''],
    };

    // const prompt =
    //   `Analyze the following job description and extract the top 10(at most 10) important keywords(technical and behavioral) based on the job description.
    // Please organize this information using the following JSON schema format:

    // It is crucial that the response json should be named "keywords" as structured format as specified.

    // ` +
    //   keywords_json_schema;
    const jsonSchema = {
      keywords: [] 
  };

  const prompt = `Analyze the following job description and extract the most important keywords. Limit the response to the top 10 keywords. Use the following JSON schema for the response:

  ${JSON.stringify(jsonSchema, null, 2)}

Job Description:
${description}`;
    try {
      const rawResponse = await this.genAIService.generateContent(prompt);
      let cleanedResponse = this.cleanAndParseResponse(rawResponse);
      const keywords = this.parseKeywordsResponse(cleanedResponse);
      // const keywords = {
      //   keywords: [],
      // };
      // keywords.keywords = cleanedResponse;
      return keywords;
    } catch (error) {
      console.error('Error extracting keywords:', error);
      throw new HttpException(
        'Failed to extract keywords',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  private parseKeywordsResponse(response: any): string[] {
    if (response) {
      if (response['top_keywords']) {
        return response['top_keywords'];
      } else if (response['keywords']) {
        return response['keywords'];
      }
    }
    throw new HttpException(
      'Invalid response format',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async extractResumeDetails(resumeRequestDto: ResumeRequestDto): Promise<any> {
    const prompt = this.createPrompt(resumeRequestDto);

    let geminiResponse = await this.genAIService.generateContent(prompt);
    let resumeData = this.cleanAndParseResponse(geminiResponse);

    let resume = plainToInstance(CreateResumeDto, resumeData);
    resume.user = resumeRequestDto.user; // Assuming user information is part of the resume DTO

    if (!this.isValidResumeData(resume)) {
      console.log('Data validation failed, retrying...');
      geminiResponse = await this.genAIService.generateContent(prompt);
      resumeData = this.cleanAndParseResponse(geminiResponse);
      resume = plainToInstance(CreateResumeDto, resumeData);
      resume.user = resumeRequestDto.user;

      if (!this.isValidResumeData(resume)) {
        throw new Error('Failed to generate valid resume data after retry.');
      }
    }

    try {
      const savedResume = await this.resumeAnalysisRepository.create(
        plainToInstance(Resume, resume),
      );

      if (!savedResume) {
        throw new HttpException(
          'Failed to save the resume data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const resumeResponseDto = this.mapResumeToResumeResponseDto(savedResume);
      return resumeResponseDto;
    } catch (error) {
      console.error('Error when saving the resume data:', error.message);
      throw new HttpException(
        'Failed to save resume data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async extractResumeDetails(resumeRequestDto: ResumeRequestDto): Promise<any> {
  //   const prompt = this.createPrompt(resumeRequestDto);
  //   let resumeData;
  //   let attempts = 0;
  //   const maxAttempts = 2; // You can adjust the max retries

  //   while (attempts < maxAttempts) {
  //     try {
  //       const response = await lastValueFrom(
  //         this.httpService.post('http://127.0.0.1:5000/extract-info', {
  //           resumeText: resumeRequestDto.resumeText,
  //         }),
  //       );

  //       resumeData = plainToInstance(CreateResumeDto, response.data.result);
  //       resumeData.user = resumeRequestDto.user;

  //       if (this.isValidResumeData(resumeData)) {
  //         break; // If the data is valid, break out of the loop
  //       } else {
  //         console.log(`Validation failed on attempt ${attempts + 1}. Retrying...`);
  //         attempts++;
  //       }
  //     } catch (error) {
  //       console.error(
  //         'Error when calling the Flask API or processing the response:',
  //         error.response?.data || error.message,
  //       );
  //       if (attempts >= maxAttempts - 1) { // Last attempt
  //         throw new HttpException(
  //           'Failed to process the resume details after retries',
  //           HttpStatus.INTERNAL_SERVER_ERROR,
  //         );
  //       }
  //       attempts++;
  //     }
  //   }

  //   if (attempts === maxAttempts && !this.isValidResumeData(resumeData)) {
  //     throw new HttpException(
  //       'Validation failed for the generated resume data after maximum retries',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }

  //   try {
  //     const savedResume = await this.resumeAnalysisRepository.create(
  //       plainToInstance(Resume, resumeData),
  //     );

  //     if (!savedResume) {
  //       throw new HttpException('Failed to save the resume data', HttpStatus.INTERNAL_SERVER_ERROR);
  //     }

  //     const resumeResponseDto = this.mapResumeToResumeResponseDto(savedResume);
  //     return resumeResponseDto;
  //   } catch (error) {
  //     console.error('Error when saving the resume data:', error.message);
  //     throw new HttpException(
  //       'Failed to save resume data',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  mapResumeToResumeResponseDto(resume: Resume): ResumeResponseDto {
    const dto = new ResumeResponseDto();
    dto.github = resume.github || '';
    dto.linkedin = resume.linkedin || '';
    dto.keyWordsToSearchForJobs = resume.keyWordsToSearchForJobs || [];
    dto.discoveryKeywords = resume.discoveryKeywords || [];
    dto.professionalSummary =
      resume.professionalSummary.map((summary) => ({
        companyName: summary.companyName || '',
        role: summary.role || '',
        durationInMonths: summary.durationInMonths || '',
      })) || [];
    dto.education =
      resume.education.map((education) => ({
        degree: education.degree || '',
        university: education.university || '',
        graduationYear: education.graduationYear || '',
      })) || [];
    dto.projects =
      resume.projects.map((project) => ({
        title: project.title || '',
        description: project.description || '',
      })) || [];
    dto.interviewPrepQuestions =
      resume.interviewPrepQuestions.map((question) => ({
        question: question.question || 'Default Question',
        sampleAnswer: question.sampleAnswer || 'Default Answer',
      })) || [];

    return dto;
  }

  cleanAndParseResponse(response: string): any {
    response = response.replace(/`/g, '').replace(/\s*json\s*/gi, '');
    return JSON.parse(response);
  }

  isValidResumeData(resumeData: any): boolean {
    const validKeywords = resumeData.keyWordsToSearchForJobs.length >= 5;
    const validDiscovery = resumeData.discoveryKeywords.length >= 5;
    const validQuestions = resumeData.interviewPrepQuestions.length >= 5;
    return validKeywords && validDiscovery && validQuestions;
  }

  createPrompt(resumeRequestDto: ResumeRequestDto): string {
    const prompt =
      resumeRequestDto.resumeText +
      `
      Analyze the attached resume to extract detailed information about the candidate's professional experience, skills, projects, and education. Carefully note the following:

      - 'professionalSummary': Highlight roles, companies, and duration in months, emphasizing the development and application of skills in each role.
      - 'skills': List all technical skills.
      - 'projects': Extract the title, description, skills used or developed, and duration in months for each project.
      - 'education': Detail degrees, institutions, and graduation years.
      
      Please organize this information into the specified JSON structure. Ensure each section is complete and adheres to the following requirements:
      - 'keyWordsToSearchForJobs': Include exactly 5 keywords tailored for job search engines.
      - 'discoveryKeywords': Include exactly 5 keywords for discovering industry insights.
      - 'interviewPrepQuestions': Provide exactly 5 potential interview questions with sample answers, related to the professional experiences, skills, and projects listed. These questions should prepare the candidate for potential interview scenarios based on their specific experiences and skills.

      It is crucial that each list contains exactly five entries and that all information is presented in a precise and structured format as specified.
      ` +
      JSON.stringify(modelResumeTemplate);
    console.log(prompt);
    return prompt;
  }

  async getResume(uuid: string): Promise<ResumeResponseDto> {
    const resume = await this.resumeAnalysisRepository.findOne(uuid);
    if (!resume) {
      throw new HttpException('Resume not found', HttpStatus.NOT_FOUND);
    }
    return this.mapResumeToResumeResponseDto(resume);
  }

  async updateProfessionalSummary(
    updateProfessionalSummaryDTO: UpdateProfessionalSummaryDTO,
  ) {
    return this.resumeAnalysisRepository.updateProfessionalSummary(
      updateProfessionalSummaryDTO,
    );
  }
}

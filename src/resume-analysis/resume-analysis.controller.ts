import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ResumeAnalysisService } from 'src/resume-analysis/resume-analysis.service';
import ResumeRequestDto from './dto/resumeRequestDto';
import { UpdateProfessionalSummaryDTO } from './dto/UpdateResumeDTO';

@Controller('resume-analysis')
export class ResumeAnalysisController {
  constructor(private readonly resumeAnalysisService: ResumeAnalysisService) {}

  @Post('extract-details')
  @HttpCode(HttpStatus.OK)
  async extractDetails(@Body() resumeRequestDto: ResumeRequestDto) {
    // Validate the resumeText if necessary
    if (!resumeRequestDto.resumeText && !resumeRequestDto.user) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Resume text is required',
      };
    }
    try {
      const extractedDetails =
        await this.resumeAnalysisService.extractResumeDetails(resumeRequestDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully extracted resume details',
        data: extractedDetails,
      };
    } catch (error) {
      console.error('Error in extracting resume details:', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while extracting resume details',
      };
    }
  }

  @Get('get-resume')
  async getResume(@Query('uuid') uuid: string) {
    if (!uuid || uuid === '') {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Resume id is required',
      };
    }
    try {
      const extractedDetails = await this.resumeAnalysisService.getResume(uuid);
      return {
        statusCode: HttpStatus.OK,
        message: 'Resume Found',
        data: extractedDetails,
      };
    } catch (error) {
      console.error('Error finding resume with uuid: ', uuid, ' :', error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while extracting resume details',
      };
    }
  }

  // In ResumeAnalysisController

@Post('extract-keywords')
async extractKeywords(@Body('description') description: string) {
    
    if (!description) {
        throw new HttpException('Description is required', HttpStatus.BAD_REQUEST);
    }
    console.log('Extracting keywords for:', description);

    try {
        const keywords = await this.resumeAnalysisService.extractKeywords(description);
        console.log('Extracted keywords:', keywords);
        return {
            statusCode: HttpStatus.OK,
            message: 'Successfully extracted keywords',
            data: keywords,
        };
    } catch (error) {
        console.error('Error in extracting keywords:', error);
        throw new HttpException('An error occurred while extracting keywords', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


  @Post('update-professional-summary')
  async updateProfessionalSummary(
    @Body() updateProfessionalSummaryDTO: UpdateProfessionalSummaryDTO,
    @Res() res,
  ) {
    try {
      await this.resumeAnalysisService.updateProfessionalSummary(
        updateProfessionalSummaryDTO,
      );
      res
        .status(HttpStatus.OK)
        .json({ message: 'Professional summary updated successfully!' });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Error updating professional summary:', error.message);
        throw new HttpException(
          'Failed to update professional summary',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}

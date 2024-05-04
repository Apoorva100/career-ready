import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { LocalLlamaModelService } from './local-llama-model.service';

@Controller('local-llama-model')
export class LocalLlamaModelController {
  constructor(
    private readonly localLlamaModelService: LocalLlamaModelService,
  ) {}

  @Post()
  async getExtractedInfo(@Body('resumeText') resumeText: string): Promise<any> {
    if (!resumeText) {
      throw new HttpException('resumeText is required', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.localLlamaModelService.extractInfo(resumeText);
    } catch (error) {
      throw new HttpException(
        'Error processing request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

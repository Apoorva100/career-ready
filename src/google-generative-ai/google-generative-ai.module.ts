import { Module } from '@nestjs/common';
import { GoogleGenerativeAiService } from './google-generative-ai.service';

@Module({
  providers: [GoogleGenerativeAiService],
  exports: [GoogleGenerativeAiService],
})
export class GoogleGenerativeAiModule {}

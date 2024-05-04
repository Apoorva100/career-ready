import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { ResumeSchema } from './entities/resume.entity';
import { ResumeAnalysisController } from './resume-analysis.controller';
import { ResumeAnalysisService } from './resume-analysis.service';
import { GoogleGenerativeAiModule } from 'src/google-generative-ai/google-generative-ai.module';
import { ResumeAnalysisRepository } from './repository/resume-analysis.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Resume', schema: ResumeSchema }]),
    GoogleGenerativeAiModule,
    HttpModule
  ],
  controllers: [ResumeAnalysisController],
  providers: [ResumeAnalysisService, ResumeAnalysisRepository],
  exports: [ResumeAnalysisService],
})
export class ResumeAnalysisModule {}

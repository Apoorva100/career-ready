import { Module } from '@nestjs/common';
import { ResumeAnalysisModule } from 'src/resume-analysis/resume-analysis.module';
import { SearchJobModule } from 'src/search-job/search-job.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [SearchJobModule, ResumeAnalysisModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}

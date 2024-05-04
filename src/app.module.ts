import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResumeAnalysisModule } from './resume-analysis/resume-analysis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GoogleGenerativeAiModule } from './google-generative-ai/google-generative-ai.module';
import { SearchJobModule } from './search-job/search-job.module';
import mongoose from 'mongoose';

import * as dotenv from 'dotenv';
import { ArticleModule } from './article/article.module';
import { UserModule } from './user/user.module';
import { LocalLlamaModelModule } from './local-llama-model/local-llama-model.module';
import { EventsModule } from './events/events.module';

dotenv.config();
const db_connection = process.env.DB_CONNECTION;
mongoose.set('debug', true);
@Module({
  imports: [
    ResumeAnalysisModule,
    MongooseModule.forRoot(`${db_connection}`),
    GoogleGenerativeAiModule,
    SearchJobModule,
    ArticleModule,
    UserModule,
    LocalLlamaModelModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

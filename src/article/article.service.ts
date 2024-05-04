import { Inject, Injectable } from '@nestjs/common';
import { ResumeAnalysisService } from 'src/resume-analysis/resume-analysis.service';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { randomUUID } from 'crypto';

@Injectable()
export class ArticleService {
  apiKey: string;
  constructor(private readonly resumeAnalysisService: ResumeAnalysisService) {
    dotenv.config();
    this.apiKey = process.env.NEWS_API_KEY;
  }

  async getArticles(uuid: string) {
    let response = await this.resumeAnalysisService.getResume(uuid);
    if (response != null) {
      const discoveryQuery = response.discoveryKeywords
        .map((term) => `"${term}"`)
        .join(' OR ');
      const options = {
        method: 'GET',
        url: 'https://newsapi.org/v2/everything',
        params: {
          apiKey: this.apiKey,
          q: discoveryQuery,
          searchIn: 'title,content',
          language: 'en',
          sortBy: 'popularity',
          pageSize: '10',
          page: '1',
        },
      };
      let apiResponse = await axios.request(options);
      return apiResponse.data.articles.filter(
        (article) => article.title !== '[Removed]',
      ).map(article => ({
        id: randomUUID(),
        source: article.source?.name,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt
      }));
      ;
    }
  }
}
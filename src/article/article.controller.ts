import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('recommended-articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getArticle(@Query('uuid') uuid: string) {
    return await this.articleService.getArticles(uuid);
  }
}

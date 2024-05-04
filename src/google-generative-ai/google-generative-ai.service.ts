import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

@Injectable()
export class GoogleGenerativeAiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    dotenv.config();
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateContent(prompt: string) {
    const result = await this.model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  }
}

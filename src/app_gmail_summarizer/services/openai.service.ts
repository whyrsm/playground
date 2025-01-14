import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async summarizeEmail(content: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes emails concisely."
          },
          {
            role: "user",
            content: `Please summarize this email in a brief, clear manner: ${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      return response.choices[0].message.content || 'No summary generated';
    } catch (error) {
      console.error('Error summarizing email:', error);
      throw error;
    }
  }
}

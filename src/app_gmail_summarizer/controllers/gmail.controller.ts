import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { GmailService } from '../services/gmail.service';

@Controller('google')
export class GmailController {
  constructor(private readonly gmailService: GmailService) {}

  @Get('auth-url')
  getAuthUrl() {
    const authUrl = this.gmailService.generateAuthUrl();
    console.log('authUrl', authUrl);
    return { authUrl };
  }

  @Post('set-credentials')
  async setCredentials(@Body() body: { access_token: string, refresh_token: string }): Promise<any> {
    return this.gmailService.setCredentials({
      access_token: body.access_token,
      refresh_token: body.refresh_token
    });
  }

  @Get('callback')
  async handleCallback(@Query('code') code: string): Promise<any> {
    if (!code) {
      return { error: 'Authorization code is required' };
    }
    return this.gmailService.getTokens(code);
  }
}

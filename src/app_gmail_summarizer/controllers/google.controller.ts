import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { GoogleService } from '../services/google.service';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('auth-url')
  getAuthUrl() {
    const authUrl = this.googleService.generateAuthUrl();
    console.log('authUrl', authUrl);
    return { authUrl };
  }

  @Post('set-credentials')
  async setCredentials(@Body() body: { access_token: string, refresh_token: string }): Promise<any> {
    return this.googleService.setCredentials({
      access_token: body.access_token,
      refresh_token: body.refresh_token
    });
  }

  @Get('callback')
  async handleCallback(@Query('code') code: string): Promise<any> {
    if (!code) {
      return { error: 'Authorization code is required' };
    }
    return this.googleService.getTokens(code);
  }
}

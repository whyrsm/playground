import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GmailService {
  private gmail;
  private oAuth2Client;

  constructor() {
    this.oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    this.gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
  }

  generateAuthUrl(): string {
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    });
  }

  async getTokens(code: string): Promise<any> {
    try {
      const { tokens } = await this.oAuth2Client.getToken(code);
      this.oAuth2Client.setCredentials(tokens);
      return tokens;
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw error;
    }
  }

  async setCredentials(tokens: any): Promise<any> {
    if (!tokens) {
      return { error: 'Tokens are required' };
    }
    this.oAuth2Client.setCredentials(tokens);

    // Save tokens to local storage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('gmail_tokens', JSON.stringify(tokens));
    } else {
      // Fallback to in-memory storage since we're in Node.js environment
      global['gmail_tokens'] = tokens;
    }

    if (this.oAuth2Client.credentials) {
      return { message: 'Credentials are set', tokens: { tokens } };
    } else {
      return { message: 'Credentials are not set' };
    }
  }

  async getEmails(date: string): Promise<any> {
    // Check if credentials are set
    if (!this.oAuth2Client.credentials) {
      // Check if tokens are stored in global storage
      const storedTokens = global['gmail_tokens'];
      if (storedTokens) {
        this.oAuth2Client.setCredentials(storedTokens);
        return { message: 'Credentials are set', tokens: { storedTokens } };
      }
      return { message: 'Credentials are not set' };
    }

    try {
      // Format date for query
      const queryDate = new Date(date);
      const formattedDate = queryDate.toISOString().split('T')[0];
      
      // Get list of messages for the specified date
      // Date param should be in YYYY-MM-DD format (e.g. 2024-01-15)
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: `after:${formattedDate} before:${formattedDate}`,
      });

      const emails = [];
      
      // Get details for each message
      if (response.data.messages) {
        for (const message of response.data.messages) {
          const email = await this.gmail.users.messages.get({
            userId: 'me',
            id: message.id,
          });

          // Extract subject and body
          const subject = email.data.payload.headers.find(
            (header) => header.name.toLowerCase() === 'subject'
          )?.value || 'No Subject';

          let body = '';
          if (email.data.payload.parts) {
            // Handle multipart messages
            body = this.getBodyFromParts(email.data.payload.parts);
          } else if (email.data.payload.body.data) {
            // Handle single part messages
            body = Buffer.from(email.data.payload.body.data, 'base64')
              .toString('utf-8');
          }

          emails.push({
            subject,
            body,
          });
        }
      }

      return { 
        message: emails.length > 0 ? 'Emails fetched successfully' : 'No emails found for this date',
        data: emails,
        count: emails.length
      };
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }

  private getBodyFromParts(parts: any[]): string {
    let body = '';
    parts.forEach(part => {
      if (part.parts) {
        body += this.getBodyFromParts(part.parts);
      } else if (part.mimeType === 'text/plain' && part.body.data) {
        body += Buffer.from(part.body.data, 'base64').toString('utf-8');
      }
    });
    return body;
  }
}

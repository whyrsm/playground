import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { text } from 'stream/consumers';

@Injectable()
export class GoogleService {
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

  async generateAuthUrl(): Promise<string> {
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
    try {
      // format date to be used in the query
      const { formattedDate, formattedNextDate } = this.formatDate(date);

      // Combine date and email filters
      const queryFilter = `after:${formattedDate} before:${formattedNextDate}`;
      
      // Modified query to search for the entire day
      const response = await  this.gmail.users.messages.list({
        userId: 'me',
        q: queryFilter,
      });

      const emails = [];
      
      // Get details for each message
      if (response.data.messages) {
        for (const message of response.data.messages) {
          const email = await this.gmail.users.messages.get({
            userId: 'me',
            id: message.id,
          });

          // Extract sender email from headers
          const headers = email.data.payload.headers;
          const from = headers.find(header => header.name.toLowerCase() === 'from');
          const senderEmail = from ? this.extractEmailAddress(from.value) : 'unknown';

          // Extract plain text content using the existing extractTextContent method
          const textContent = this.extractTextContent(email.data.payload);

          // Extract date from headers
          const dateHeader = headers.find(header => header.name.toLowerCase() === 'date');
          const emailDate = dateHeader ? new Date(dateHeader.value) : new Date(); 

          emails.push({
            id: message.id,
            emailDate: emailDate,
            sender: senderEmail,
            subject: headers.find(header => header.name.toLowerCase() === 'subject')?.value || '',
            content: textContent,
          });
        }
      }

      return { 
        message: 'Emails fetched successfully', 
        date: date,
        query_filter: queryFilter,
        count: emails.length ,
        data: emails, 
      };
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }

  private extractEmailAddress(from: string): string {
    const matches = from.match(/<(.+?)>/);
    if (matches) {
        return matches[1];
    }
    // If no angle brackets, assume the entire string is an email
    return from.trim();
  }

  private cleanTextContent(textContent: string): string {
    textContent = textContent.replace(/<[^>]*>|[\n\r]/g, '');
    textContent = textContent.replace(/https?:\/\/\S+/g, '');
    textContent = textContent.replace(/\s+/g, ' ');
    textContent = textContent.trim();
    return textContent;
  }

  private formatDate(date: string): { formattedDate: string; formattedNextDate: string } {
    const queryDate = new Date(date);
    const nextDate = new Date(queryDate);
    queryDate.setDate(queryDate.getDate() - 1);
    nextDate.setDate(nextDate.getDate() + 1);

    const formattedDate = queryDate.toISOString().split('T')[0];
    const formattedNextDate = nextDate.toISOString().split('T')[0];
    return { formattedDate, formattedNextDate };
  }
  
  private extractTextContent(payload): string {
    let textContent = '';
    
    // Handle nested parts
    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain') {
          textContent = Buffer.from(part.body.data, 'base64').toString();
          break;
        }
      }
    } 
    // Handle messages with no parts but direct body
    else if (payload.body && payload.body.data) {
      textContent = Buffer.from(payload.body.data, 'base64').toString();
    }

    return this.cleanTextContent(textContent);
  }  
}

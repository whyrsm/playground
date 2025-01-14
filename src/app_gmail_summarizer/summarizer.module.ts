import { Module } from '@nestjs/common';
import { GoogleService } from './services/google.service';
import { SummaryController } from './controllers/summary.controller';
import { GoogleController } from './controllers/google.controller';

@Module({
  providers: [GoogleService],
  controllers: [SummaryController, GoogleController],
})
export class SummarizerModule {}

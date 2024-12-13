import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExchangesModule } from "./exchanges/exchanges.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ExchangesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

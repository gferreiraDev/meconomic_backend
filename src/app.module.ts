import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SendgridModule } from './services/sendgrid/sendgrid.module';
import { TwilioModule } from './services/twilio/twilio.module';
import { StatementsModule } from './statements/statements.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    SendgridModule,
    TwilioModule,
    StatementsModule,
    CardsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

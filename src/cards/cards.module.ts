import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { StatementsModule } from '../statements/statements.module';

@Module({
  imports: [StatementsModule],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}

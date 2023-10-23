import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { StatementsModule } from '../statements/statements.module';
import { PurchaseModule } from 'src/purchase/purchase.module';

@Module({
  imports: [StatementsModule, PurchaseModule],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}

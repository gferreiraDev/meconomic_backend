import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SendgridModule } from './services/sendgrid/sendgrid.module';
import { StatementsModule } from './statements/statements.module';
import { CardsModule } from './cards/cards.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PurchaseModule } from './purchase/purchase.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ReserveModule } from './reserve/reserve.module';
import { PaymentModule } from './payment/payment.module';
import { TargetModule } from './target/target.module';
import { InvestmentModule } from './investment/investment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    SendgridModule,
    StatementsModule,
    CardsModule,
    TransactionsModule,
    DashboardModule,
    PurchaseModule,
    InvoiceModule,
    ReserveModule,
    PaymentModule,
    TargetModule,
    InvestmentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

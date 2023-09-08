import { Module } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';
// import { HttpModule } from '@nestjs/axios';
import { MailService } from '@sendgrid/mail';

@Module({
  // imports: [HttpModule],
  providers: [SendgridService, MailService],
  exports: [SendgridService],
})
export class SendgridModule {}

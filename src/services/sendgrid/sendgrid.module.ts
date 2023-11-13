import { Module } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';
import { MailService } from '@sendgrid/mail';

@Module({
  providers: [SendgridService, MailService],
  exports: [SendgridService],
})
export class SendgridModule {}

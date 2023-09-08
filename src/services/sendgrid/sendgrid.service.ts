import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  constructor(private configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async sendEmail(data: SendGrid.MailDataRequired): Promise<any> {
    console.log(data);
    try {
      const transport = await SendGrid.send(data);

      console.log(transport);
      console.log('Email Sent to', data.to);

      return transport;
    } catch (error) {
      console.log('Ocorreu um erro:', error);
    }
  }
}

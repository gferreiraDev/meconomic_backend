import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  constructor(private configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async sendEmail(data: SendGrid.MailDataRequired): Promise<any> {
    try {
      const transport = await SendGrid.send(data);

      return transport;
    } catch (error) {
      console.log(error);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioService {
  constructor(private readonly configService: ConfigService) {}

  async sendSMS(data: any): Promise<any> {
    const twilio = Twilio(
      this.configService.get<string>('TWILIO_SID'),
      this.configService.get<string>('TWILIO_AUTH'),
    );

    const sms = await twilio.messages.create({
      from: this.configService.get<string>('TWILIO_ORIGIN_NUMBER'),
      ...data,
    });

    return sms;
  }
}

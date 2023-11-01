import { Test, TestingModule } from '@nestjs/testing';
import { TwilioService } from './twilio.service';
import { ConfigService } from '@nestjs/config';

describe('TwilioService', () => {
  let twilioService: TwilioService;
  let configService: ConfigService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, TwilioService],
    }).compile();

    twilioService = testingModule.get<TwilioService>(TwilioService);
    configService = testingModule.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(twilioService).toBeDefined();
    expect(configService).toBeDefined();
  });
});

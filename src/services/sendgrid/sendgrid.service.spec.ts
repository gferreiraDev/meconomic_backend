import { Test, TestingModule } from '@nestjs/testing';
import { SendgridService } from './sendgrid.service';
import { ConfigService } from '@nestjs/config';

describe('SendgridService', () => {
  let sendgridService: SendgridService;
  let configService: ConfigService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, SendgridService],
    }).compile();

    sendgridService = testingModule.get<SendgridService>(SendgridService);
    configService = testingModule.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(sendgridService).toBeDefined();
    expect(configService).toBeDefined();
  });
});

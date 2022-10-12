import { Test, TestingModule } from '@nestjs/testing';
import { WeChatService } from './we-chat.service';

describe('WeChatService', () => {
  let service: WeChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeChatService],
    }).compile();

    service = module.get<WeChatService>(WeChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

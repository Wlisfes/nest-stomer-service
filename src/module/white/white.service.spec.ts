import { Test, TestingModule } from '@nestjs/testing';
import { WhiteService } from './white.service';

describe('WhiteService', () => {
  let service: WhiteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhiteService],
    }).compile();

    service = module.get<WhiteService>(WhiteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

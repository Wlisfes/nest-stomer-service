import { Test, TestingModule } from '@nestjs/testing';
import { ChacterService } from './chacter.service';

describe('ChacterService', () => {
  let service: ChacterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChacterService],
    }).compile();

    service = module.get<ChacterService>(ChacterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

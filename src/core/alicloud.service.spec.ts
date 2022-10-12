import { Test, TestingModule } from '@nestjs/testing';
import { AlicloudService } from './alicloud.service';

describe('AlicloudService', () => {
  let service: AlicloudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlicloudService],
    }).compile();

    service = module.get<AlicloudService>(AlicloudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

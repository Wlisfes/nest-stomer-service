import { Test, TestingModule } from '@nestjs/testing';
import { WhiteController } from './white.controller';

describe('WhiteController', () => {
  let controller: WhiteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhiteController],
    }).compile();

    controller = module.get<WhiteController>(WhiteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

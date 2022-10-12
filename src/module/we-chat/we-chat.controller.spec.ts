import { Test, TestingModule } from '@nestjs/testing';
import { WeChatController } from './we-chat.controller';

describe('WeChatController', () => {
  let controller: WeChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeChatController],
    }).compile();

    controller = module.get<WeChatController>(WeChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

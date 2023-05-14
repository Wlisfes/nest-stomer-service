import { Test, TestingModule } from '@nestjs/testing';
import { ChacterController } from './chacter.controller';

describe('ChacterController', () => {
  let controller: ChacterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChacterController],
    }).compile();

    controller = module.get<ChacterController>(ChacterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

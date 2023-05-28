import { Test, TestingModule } from '@nestjs/testing';
import { DexcomController } from './dexcom.controller';
import { DexcomService } from './dexcom.service';

describe('DexcomController', () => {
  let controller: DexcomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DexcomController],
      providers: [DexcomService],
    }).compile();

    controller = module.get<DexcomController>(DexcomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DexcomService } from './dexcom.service';

describe('DexcomService', () => {
  let service: DexcomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DexcomService],
    }).compile();

    service = module.get<DexcomService>(DexcomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

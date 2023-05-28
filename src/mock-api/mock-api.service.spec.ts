import { Test, TestingModule } from '@nestjs/testing';
import { MockApiService } from './mock-api.service';

describe('MockApiService', () => {
  let service: MockApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockApiService],
    }).compile();

    service = module.get<MockApiService>(MockApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

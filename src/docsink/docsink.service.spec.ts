import { Test, TestingModule } from '@nestjs/testing';
import { DocsinkService } from './docsink.service';

describe('DocsinkService', () => {
  let service: DocsinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocsinkService],
    }).compile();

    service = module.get<DocsinkService>(DocsinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

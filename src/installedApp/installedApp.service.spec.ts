import { Test, TestingModule } from '@nestjs/testing';
import { InstalledAppService } from './installedApp.service';

describe('InstalledAppService', () => {
  let service: InstalledAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstalledAppService],
    }).compile();

    service = module.get<InstalledAppService>(InstalledAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

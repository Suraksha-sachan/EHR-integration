import { Test, TestingModule } from '@nestjs/testing';
import { InstalledAppController } from './installedApp.controller';
import { InstalledAppService } from './installedApp.service';

describe('InstalledAppController', () => {
  let controller: InstalledAppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstalledAppController],
      providers: [InstalledAppService],
    }).compile();

    controller = module.get<InstalledAppController>(InstalledAppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

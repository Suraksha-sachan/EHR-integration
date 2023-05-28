import { Test, TestingModule } from '@nestjs/testing';
import { EhrFaxorderService } from './ehrFaxorder.service';

describe('FaxorderService', () => {
  let service: EhrFaxorderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EhrFaxorderService],
    }).compile();

    service = module.get<EhrFaxorderService>(EhrFaxorderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

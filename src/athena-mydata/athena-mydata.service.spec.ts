import { Test, TestingModule } from '@nestjs/testing';
import { AthenaMydataService } from './athena-mydata.service';

describe('AthenaMydataService', () => {
  let service: AthenaMydataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AthenaMydataService],
    }).compile();

    service = module.get<AthenaMydataService>(AthenaMydataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

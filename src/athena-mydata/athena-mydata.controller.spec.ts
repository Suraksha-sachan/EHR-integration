import { Test, TestingModule } from '@nestjs/testing';
import { AthenaMydataController } from './athena-mydata.controller';
import { AthenaMydataService } from './athena-mydata.service';

describe('AthenaMydataController', () => {
  let controller: AthenaMydataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AthenaMydataController],
      providers: [AthenaMydataService],
    }).compile();

    controller = module.get<AthenaMydataController>(AthenaMydataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

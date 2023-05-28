import { Test, TestingModule } from '@nestjs/testing';
import { EhrFaxorderController } from './ehrFaxorder.controller';
import {EhrFaxorderService } from './ehrFaxorder.service';

describe('FaxorderController', () => {
  let controller: EhrFaxorderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EhrFaxorderController],
      providers: [EhrFaxorderService],
    }).compile();

    controller = module.get<EhrFaxorderController>(EhrFaxorderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

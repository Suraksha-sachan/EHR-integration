import { Test, TestingModule } from '@nestjs/testing';
import { MockApiController } from './mock-api.controller';
import { MockApiService } from './mock-api.service';

describe('MockApiController', () => {
  let controller: MockApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockApiController],
      providers: [MockApiService],
    }).compile();

    controller = module.get<MockApiController>(MockApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

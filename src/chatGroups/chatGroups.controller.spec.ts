import { Test, TestingModule } from '@nestjs/testing';
import { ChatGroupsController } from './chatGroups.controller';
import { ChatGroupsService } from './chatGroups.service';

describe('GroupsController', () => {
  let controller: ChatGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatGroupsController],
      providers: [ChatGroupsService],
    }).compile();

    controller = module.get<ChatGroupsController>(ChatGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

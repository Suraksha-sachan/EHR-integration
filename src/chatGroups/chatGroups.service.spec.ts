import { Test, TestingModule } from '@nestjs/testing';
import { describe } from 'node:test';
import { ChatGroupsService } from './chatGroups.service';

describe('GroupsService', () => {
  let service: ChatGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGroupsService],
    }).compile();

    service = module.get<ChatGroupsService>(ChatGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

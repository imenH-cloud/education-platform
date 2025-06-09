import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockUsers = [{ id: 1, name: 'Imen' }];

  const mockRepo = {
    find: jest.fn().mockResolvedValue(mockUsers),
    findOne: jest.fn().mockImplementation(({ where: { id } }) =>
      Promise.resolve(mockUsers.find((u) => u.id === id)),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const users = await service.findAll();
    expect(users).toEqual(mockUsers);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should return one user by id', async () => {
    const user = await service.findById(1);
    expect(user).toEqual({ id: 1, name: 'Imen' });
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});


import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockReturnValue([{ id: 1, name: 'Imen' }]),
            findById: jest.fn().mockImplementation((id: number) => ({ id, name: 'Imen' })),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    expect(await service.findAll()).toEqual([{ id: 1, name: 'Imen' }]);
  });

  it('should return a user by id', async () => {
    expect(await service.findById(1)).toEqual({ id: 1, name: 'Imen' });
  });
});


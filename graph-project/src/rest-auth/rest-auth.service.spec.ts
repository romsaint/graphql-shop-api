import { Test, TestingModule } from '@nestjs/testing';
import { RestAuthService } from './rest-auth.service';

describe('RestAuthService', () => {
  let service: RestAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestAuthService],
    }).compile();

    service = module.get<RestAuthService>(RestAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { RestAuthController } from './rest-auth.controller';
import { RestAuthService } from './rest-auth.service';

describe('RestAuthController', () => {
  let controller: RestAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestAuthController],
      providers: [RestAuthService],
    }).compile();

    controller = module.get<RestAuthController>(RestAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

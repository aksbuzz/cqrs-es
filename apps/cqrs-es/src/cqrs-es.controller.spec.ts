import { Test, TestingModule } from '@nestjs/testing';
import { CqrsEsController } from './cqrs-es.controller';
import { CqrsEsService } from './cqrs-es.service';

describe('CqrsEsController', () => {
  let cqrsEsController: CqrsEsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CqrsEsController],
      providers: [CqrsEsService],
    }).compile();

    cqrsEsController = app.get<CqrsEsController>(CqrsEsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(cqrsEsController.getHello()).toBe('Hello World!');
    });
  });
});

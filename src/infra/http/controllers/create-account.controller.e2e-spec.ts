import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create Account (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      nameOfPersonResponsible: 'John Doe',
      email: 'johndoe@example.com',
      city: 'test city',
      cep: '123456789',
      address: 'test address',
      whatsapp: '123456789',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);

    const orgOnDatabase = await prisma.org.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    });

    expect(orgOnDatabase).toBeTruthy();
  });
});

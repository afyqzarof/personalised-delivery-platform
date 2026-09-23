import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';

// A known user from data.json: Cordell has one active cat (Betsy, pouch E).
const KNOWN_USER_ID = '618f4ed6-1c5b-4993-a149-f64700bf31dd';

describe('GET /comms/your-next-delivery/:userId (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 200 and the correct body for a known user', () => {
    return request(app.getHttpServer())
      .get(`/comms/your-next-delivery/${KNOWN_USER_ID}`)
      .expect(200)
      .expect({
        title: 'Your next delivery for Betsy',
        message:
          "Hey Cordell! In two days' time, we'll be charging you for your next order for Betsy's fresh food.",
        totalPrice: 69,
        freeGift: false,
      });
  });

  it('returns 404 for a valid but unknown UUID', () => {
    return request(app.getHttpServer())
      .get('/comms/your-next-delivery/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });

  it('returns 400 for a non-UUID userId', () => {
    return request(app.getHttpServer())
      .get('/comms/your-next-delivery/not-a-uuid')
      .expect(400);
  });
});

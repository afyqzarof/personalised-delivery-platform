import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow the browser frontend to call the API. FRONTEND_ORIGIN can be a
  // comma-separated list; unset reflects the request origin (handy in dev).
  const origins = process.env.FRONTEND_ORIGIN?.split(',').map((o) => o.trim());
  app.enableCors({ origin: origins ?? true });

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
}
bootstrap();

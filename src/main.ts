import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
  });
  await app.listen(process.env.PORT ?? 3005, () => {
    console.log(
      `Server is running on port http://localhost:${process.env.PORT ?? 3005}`,
    );
  });
}
bootstrap();

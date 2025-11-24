import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
  });
  app.enableCors({
    // origin: ['http://localhost:5173'],
    origin: ['https://dancing-longma-3d3bef.netlify.app'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3005, () => {
    console.log(
      `Server is running on port http://localhost:${process.env.PORT ?? 3005}`,
    );
  });
}
bootstrap();

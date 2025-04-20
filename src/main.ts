import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = 3005
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  console.log(`app listening in http://localhost:${port}`)
}
bootstrap();

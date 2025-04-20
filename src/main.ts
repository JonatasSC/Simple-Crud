import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomException } from './commun/exceptions/custom-exceptions/custom-exception.service';
import { HttpExceptionFilter } from './commun/exceptions/filters/http-execption.filter';
import { SuccessResponseInterceptor } from './commun/exceptions/interceptors/success/success.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const customException = app.get(CustomException)
  app.useGlobalFilters(app.get(HttpExceptionFilter))

  app.useGlobalInterceptors(app.get(SuccessResponseInterceptor))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  await app.listen(process.env.PORT || 3002);
  console.log(`app listening in http://localhost:${process.env.PORT}`)
}
bootstrap();

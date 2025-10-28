import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

// Функция для логирования
function log(message: string) {
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(path.join(logDir, 'app.log'), logMessage);
  console.log(logMessage);
}

async function bootstrap() {
  log('Запуск приложения...');
  const app = await NestFactory.create(AppModule);
  
  // Включаем CORS для фронтенда
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });
  
  // Глобальная валидация
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Глобальный префикс для API
  app.setGlobalPrefix('api');
  
  await app.listen(3001);
  log('🚀 Backend server is running on http://localhost:3001');
}
bootstrap().catch(err => {
  log(`Ошибка при запуске: ${err.message}`);
});
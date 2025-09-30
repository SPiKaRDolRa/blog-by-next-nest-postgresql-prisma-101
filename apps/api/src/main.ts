import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // เปิดใช้งาน validation pipe ทั่วแอป เพื่อความปลอดภัยของข้อมูลเข้า
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  // ใส่ Interceptor สำหรับบันทึก request/response time
  app.useGlobalInterceptors(new LoggingInterceptor());
  // เปิด CORS แบบยืดหยุ่น: หากมีตัวแปร CORS_ORIGINS จะจำกัดตามโดเมนที่กำหนด, ไม่งั้นอนุญาตทั้งหมดเพื่อสะดวกในการเดโม
  const origins = process.env.CORS_ORIGINS?.split(',').map((s) => s.trim());
  app.enableCors({ origin: origins && origins.length > 0 ? origins : true, credentials: false });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

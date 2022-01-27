import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        (process.env.NODE_ENV && `.env.${process.env.NODE_ENV}`) ||
        '.env.development',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    CoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

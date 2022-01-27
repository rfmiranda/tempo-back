import { Module } from '@nestjs/common';
import { CoreService } from './service/core.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreController } from './controllers/core.controller';

import { MulterModule } from '@nestjs/platform-express';
import { Cadastro, CadastroSchema } from './entities/cadastro.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cadastro.name, schema: CadastroSchema },
    ]),
    MulterModule.register({
      dest: './upload',
    }),
  ],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}

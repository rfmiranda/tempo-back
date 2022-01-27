import { Injectable, UploadedFile } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { Cadastro, CadastroDocument } from '../entities/cadastro.entity';

import { ReadExcelFile } from '../../utils/excel';
import { CreateCadastroDto } from '../dto/cadastro.dto';

@Injectable()
export class CoreService {
  constructor(
    @InjectModel(Cadastro.name)
    private modelCadastro: Model<CadastroDocument>,
  ) {}

  async processarFile(@UploadedFile() file: Express.Multer.File) {
    fs.renameSync(
      path.resolve(process.cwd(), file.path),
      path.resolve(process.cwd(), `upload/${file.originalname}`),
    );

    const options = {
      header: ['nome', 'dataNascimento', 'cep', 'endereco', 'cidade', 'estado'],
      blankrows: false,
    };

    const data = ReadExcelFile(
      path.resolve(process.cwd(), `upload/${file.originalname}`),
      options,
    );

    await this.modelCadastro.collection.insertMany(data);
  }

  async query(query, param: { tipo: string; opt: string }) {
    let response = null;
    switch (param.tipo) {
      case 'list':
        response = await this._getList(query);
        break;
      case 'cadastrar':
        response = await this._cadastrar(query);
        break;
      default:
        break;
    }

    return response;
  }

  async _cadastrar(dados: CreateCadastroDto) {
    dados.dataNascimento = moment(dados.dataNascimento).toDate();
    const valor = new this.modelCadastro(dados);

    return await valor.save();
  }

  async _getList(query: any): Promise<any> {
    const { filters } = query;
    const filter: any = {
      nome: { $ne: null },
    };

    if (filters) {
      if (filters.nome) filter.nome = { $regex: new RegExp(filters.nome, 'i') };
    }

    const q = await this.modelCadastro
      .aggregate([
        {
          $match: {
            nome: filter.nome,
          },
        },
      ])
      .exec();

    return q;
  }
}

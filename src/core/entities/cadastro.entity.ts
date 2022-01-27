import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CadastroDocument = Cadastro & Document;

@Schema()
export class Cadastro {
  @Prop({})
  nome: string;

  @Prop({ type: Date })
  dataNascimento: Date;

  @Prop({})
  cep: string;

  @Prop({})
  endereco: string;

  @Prop({})
  cidade: string;

  @Prop({})
  estado: string;
}

const CadastroSchema = SchemaFactory.createForClass(Cadastro);

export { CadastroSchema };

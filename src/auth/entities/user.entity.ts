import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({})
  creci?: number;

  @Prop({})
  imobiliaria?: string;

  @Prop({
    required: true,
    minlength: [6, 'Por favor digite uma senha com no mínimo 6 caracteres.'],
  })
  pass: string;

  @Prop({ require: true, default: 'User' })
  role: string;

  @Prop({ type: Date, required: true })
  createAt: Date;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', async function () {
  this['pass'] = await bcrypt.hash(this['pass'], saltOrRounds);
});

UserSchema.methods.compare = async function (pass) {
  return await bcrypt.compare(pass, this['pass']);
};

UserSchema.methods.hashPassword = async function (pass) {
  return await bcrypt.hash(pass, saltOrRounds);
};
export { UserSchema };

export class CreateUserDto {
  name: string;
  email: string;
  pass: string;
  role: string;
  creci?: number;
  imobiliaria?: string;
  createAt: Date;
}

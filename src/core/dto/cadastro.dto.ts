export class CreateCadastroDto {
  nome: string;
  dataNascimento: string | Date;
  cep: string;
  endereco: string;
  cidade: string;
  estado: number;
}

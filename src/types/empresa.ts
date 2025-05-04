export interface Empresa {
  _id?: string;
  nome: string;
  razaoSocial: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  logo?: string; // URL da imagem
}

export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Cliente {
  _id?: string;
  nome: string;
  telefone: string;
  email: string;
  endereco: Endereco;
}

export interface Prestador {
  _id?: string;
  nome: string;
  telefone: string;
  email: string;
  especialidade: string;
}

export interface Produto {
  _id?: string;
  nome: string;
  descricao?: string;
  preco: number;
}

export interface ItemOS {
  produto: string | Produto;
  quantidade: number;
  valorUnitario: number;
  descricao?: string;
}

export interface OrdemServico {
  _id?: string;
  numero: string;
  data: string;
  cliente: string | Cliente;
  prestador: string | Prestador;
  status: string;
  descricaoServico: string;
  produtos: ItemOS[];
  valorTotal: number;
  observacoes?: string;
}

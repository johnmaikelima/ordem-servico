export interface Cliente {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  endereco: string;
}

export interface Prestador {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  especialidade: string;
}

export interface Produto {
  _id: string;
  nome: string;
  descricao: string;
  precoUnitario: number;
  estoque: number;
}

export type StatusOS = 'aberto' | 'em_andamento' | 'concluido' | 'cancelado';

export interface OrdemServico {
  _id: string;
  numero: string;
  cliente: string | Cliente;
  prestador: string | Prestador;
  dataPrevisao: string;
  dataCriacao: string;
  descricao: string;
  status: StatusOS;
  servicos: Array<{
    descricao: string;
    quantidade: number;
    precoUnitario: number;
    total: number;
  }>;
  produtos: Array<{
    produto: string | Produto;
    quantidade: number;
    precoUnitario: number;
    total: number;
  }>;
  valorTotal: number;
  valorServicos: number;
  valorProdutos: number;
}

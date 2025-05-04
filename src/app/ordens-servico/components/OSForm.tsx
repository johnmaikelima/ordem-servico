'use client';

import React, { useState, useEffect } from 'react';
import { Cliente, Prestador, Produto } from '@/types';
import ProdutoForm from './ProdutoForm';

interface FormData {
  numero?: string;
  status?: string;
  cliente: string;
  prestador: string;
  dataPrevisao: string;
  descricao: string;
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
    descricao: string;
  }>;
  valorTotal: number;
  valorServicos: number;
  valorProdutos: number;
}

interface Props {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  clientes: Cliente[];
  prestadores: Prestador[];
  produtos: Produto[];
  initialData?: {
    _id?: string;
    numero?: string;
    status?: string;
    cliente: string | Cliente;
    prestador: string | Prestador;
    dataPrevisao: string;
    descricao: string;
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
      descricao: string;
    }>;
    valorTotal: number;
    valorServicos: number;
    valorProdutos: number;
  };
  isEditing?: boolean;
}

function getIdFromStringOrObject(value: string | { _id: string } | null | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value._id;
}

export default function OSForm({ clientes, prestadores, produtos, onSubmit, onCancel, initialData, isEditing }: Props) {
  const [formData, setFormData] = useState<FormData>(() => {
    if (initialData) {
      return {
        numero: initialData.numero || '',
        status: initialData.status || 'aberto',
        cliente: getIdFromStringOrObject(initialData.cliente),
        prestador: getIdFromStringOrObject(initialData.prestador),
        dataPrevisao: initialData.dataPrevisao ? new Date(initialData.dataPrevisao).toISOString().split('T')[0] : '',
        descricao: initialData.descricao,
        servicos: initialData.servicos,
        produtos: initialData.produtos.map(p => ({
          ...p,
          produto: getIdFromStringOrObject(p.produto)
        })),
        valorTotal: initialData.valorTotal,
        valorServicos: initialData.valorServicos,
        valorProdutos: initialData.valorProdutos
      };
    }
    return {
      numero: '',
      status: 'aberto',
      cliente: '',
      prestador: '',
      dataPrevisao: '',
      descricao: '',
      servicos: [],
      produtos: [],
      valorTotal: 0,
      valorServicos: 0,
      valorProdutos: 0
    };
  });

  const [produtoTemp, setProdutoTemp] = useState({
    produto: '',
    quantidade: 1,
    precoUnitario: 0,
    descricao: ''
  });

  const [showProdutoForm, setShowProdutoForm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServicoChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const servicos = [...prev.servicos];
      servicos[index] = {
        ...servicos[index],
        [field]: value,
        total: field === 'quantidade' || field === 'precoUnitario' 
          ? Number(value) * (field === 'quantidade' ? servicos[index].precoUnitario : servicos[index].quantidade)
          : servicos[index].total
      };

      const valorServicos = servicos.reduce((acc, curr) => acc + curr.total, 0);
      return {
        ...prev,
        servicos,
        valorServicos,
        valorTotal: valorServicos + prev.valorProdutos
      };
    });
  };

  const handleProdutoChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const produtos = [...prev.produtos];
      produtos[index] = {
        ...produtos[index],
        [field]: value,
        total: field === 'quantidade' || field === 'precoUnitario' 
          ? Number(value) * (field === 'quantidade' ? produtos[index].precoUnitario : produtos[index].quantidade)
          : produtos[index].total
      };

      const valorProdutos = produtos.reduce((acc, curr) => acc + curr.total, 0);
      return {
        ...prev,
        produtos,
        valorProdutos,
        valorTotal: prev.valorServicos + valorProdutos
      };
    });
  };

  const adicionarServico = () => {
    setFormData(prev => ({
      ...prev,
      servicos: [
        ...prev.servicos,
        { descricao: '', quantidade: 1, precoUnitario: 0, total: 0 }
      ]
    }));
  };

  const adicionarProduto = () => {
    setFormData(prev => ({
      ...prev,
      produtos: [
        ...prev.produtos,
        { produto: '', quantidade: 1, precoUnitario: 0, total: 0, descricao: '' }
      ]
    }));
  };

  const removerServico = (index: number) => {
    setFormData(prev => {
      const servicos = prev.servicos.filter((_, i) => i !== index);
      const valorServicos = servicos.reduce((acc, curr) => acc + curr.total, 0);
      return {
        ...prev,
        servicos,
        valorServicos,
        valorTotal: valorServicos + prev.valorProdutos
      };
    });
  };

  const removerProduto = (index: number) => {
    setFormData(prev => {
      const produtos = prev.produtos.filter((_, i) => i !== index);
      const valorProdutos = produtos.reduce((acc, curr) => acc + curr.total, 0);
      return {
        ...prev,
        produtos,
        valorProdutos,
        valorTotal: prev.valorServicos + valorProdutos
      };
    });
  };

  const handleAddProduto = () => {
    if (!produtoTemp.produto && !produtoTemp.descricao) {
      alert('Informe o produto ou sua descrição');
      return;
    }

    setFormData(prev => ({
      ...prev,
      produtos: [...prev.produtos, produtoTemp],
      valorProdutos: prev.valorProdutos + (produtoTemp.quantidade * produtoTemp.precoUnitario)
    }));

    setProdutoTemp({
      produto: '',
      quantidade: 1,
      precoUnitario: 0,
      descricao: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleProdutoSubmit = (produtoData: any) => {
    setFormData(prev => ({
      ...prev,
      produtos: [
        ...prev.produtos,
        {
          produto: produtoData._id,
          quantidade: 1,
          precoUnitario: produtoData.precoUnitario,
          total: produtoData.precoUnitario,
          descricao: ''
        }
      ]
    }));
    setShowProdutoForm(false);
  };

  useEffect(() => {
    if (formData.produtos.length > 0) {
      const valorProdutos = formData.produtos.reduce((acc, curr) => acc + curr.total, 0);
      setFormData(prev => ({
        ...prev,
        valorProdutos,
        valorTotal: prev.valorServicos + valorProdutos
      }));
    }
  }, [formData.produtos]);

  useEffect(() => {
    if (formData.servicos.length > 0) {
      const valorServicos = formData.servicos.reduce((acc, curr) => acc + curr.total, 0);
      setFormData(prev => ({
        ...prev,
        valorServicos,
        valorTotal: valorServicos + prev.valorProdutos
      }));
    }
  }, [formData.servicos]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente</label>
          <select
            name="cliente"
            value={formData.cliente}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Selecione um cliente</option>
            {clientes.map(cliente => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prestador</label>
          <select
            name="prestador"
            value={formData.prestador}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Selecione um prestador</option>
            {prestadores.map(prestador => (
              <option key={prestador._id} value={prestador._id}>
                {prestador.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data Prevista</label>
          <input
            type="date"
            name="dataPrevisao"
            value={formData.dataPrevisao}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="aberto">Aberto</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Serviços</h3>
          <button
            type="button"
            onClick={adicionarServico}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Adicionar Serviço
          </button>
        </div>
        <div className="space-y-4">
          {formData.servicos.map((servico, index) => (
            <div key={index} className="grid grid-cols-5 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <input
                  type="text"
                  value={servico.descricao}
                  onChange={(e) => handleServicoChange(index, 'descricao', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantidade</label>
                <input
                  type="number"
                  min="1"
                  value={servico.quantidade}
                  onChange={(e) => handleServicoChange(index, 'quantidade', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preço Unitário</label>
                <input
                  type="number"
                  step="0.01"
                  value={servico.precoUnitario}
                  onChange={(e) => handleServicoChange(index, 'precoUnitario', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removerServico(index)}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Produtos</h3>
          <div className="space-x-2">
            <button
              type="button"
              onClick={() => setShowProdutoForm(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
            >
              Novo Produto
            </button>
            <button
              type="button"
              onClick={adicionarProduto}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Adicionar Existente
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Produtos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Produto Cadastrado (opcional)
              </label>
              <select
                name="produto"
                value={produtoTemp.produto}
                onChange={e => setProdutoTemp({
                  ...produtoTemp,
                  produto: e.target.value,
                  precoUnitario: produtos.find(p => p._id === e.target.value)?.precoUnitario || 0
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Selecione um produto</option>
                {produtos.map(produto => (
                  <option key={produto._id} value={produto._id}>
                    {produto.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição do Produto
              </label>
              <input
                type="text"
                name="descricao"
                value={produtoTemp.descricao}
                onChange={e => setProdutoTemp({
                  ...produtoTemp,
                  descricao: e.target.value
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Descreva o produto se não estiver cadastrado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantidade
              </label>
              <input
                type="number"
                name="quantidade"
                value={produtoTemp.quantidade}
                onChange={e => setProdutoTemp({
                  ...produtoTemp,
                  quantidade: Number(e.target.value)
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor Unitário
              </label>
              <input
                type="number"
                name="valorUnitario"
                value={produtoTemp.precoUnitario}
                onChange={e => setProdutoTemp({
                  ...produtoTemp,
                  precoUnitario: Number(e.target.value)
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddProduto}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Adicionar Produto
          </button>

          {formData.produtos.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Produtos Adicionados</h4>
              <ul className="divide-y divide-gray-200">
                {formData.produtos.map((item, index) => (
                  <li key={index} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {typeof item.produto === 'string' 
                          ? produtos.find(p => p._id === item.produto)?.nome || item.descricao 
                          : item.produto.nome || item.descricao}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qtd: {item.quantidade} x R$ {item.precoUnitario.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removerProduto(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4">
        <dl className="grid grid-cols-3 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Serviços</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">
              R$ {formData.valorServicos.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Produtos</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">
              R$ {formData.valorProdutos.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-700">Total Geral</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">
              R$ {formData.valorTotal.toFixed(2)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Salvar Ordem de Serviço
        </button>
      </div>
      <div className="mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancelar
        </button>
      </div>

      {showProdutoForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Novo Produto</h2>
            <ProdutoForm
              onSubmit={handleProdutoSubmit}
              onCancel={() => setShowProdutoForm(false)}
            />
          </div>
        </div>
      )}
    </form>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Cliente, Prestador, Produto, OrdemServico, ItemProduto } from '@/types';

interface Props {
  clientes: Cliente[];
  prestadores: Prestador[];
  onSubmit: (data: OrdemServico) => void;
  onCancel: () => void;
  initialData?: Partial<OrdemServico>;
}

export default function OSForm({ clientes, prestadores, onSubmit, onCancel, initialData }: Props) {
  const [formData, setFormData] = useState<OrdemServico>({
    numero: '',
    data: new Date().toISOString().split('T')[0],
    cliente: '',
    prestador: '',
    status: 'aberto',
    descricaoServico: '',
    produtos: [],
    valorTotal: 0,
    observacoes: ''
  });

  const [produtoTemp, setProdutoTemp] = useState<ItemProduto>({
    descricao: '',
    quantidade: 1,
    valorUnitario: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProduto = () => {
    if (!produtoTemp.descricao) {
      toast.error('Informe a descrição do produto');
      return;
    }

    setFormData(prev => ({
      ...prev,
      produtos: [...prev.produtos, produtoTemp],
      valorTotal: prev.valorTotal + (produtoTemp.quantidade * produtoTemp.valorUnitario)
    }));

    setProdutoTemp({
      descricao: '',
      quantidade: 1,
      valorUnitario: 0
    });
  };

  const handleRemoveProduto = (index: number) => {
    setFormData(prev => {
      const produto = prev.produtos[index];
      return {
        ...prev,
        produtos: prev.produtos.filter((_, i) => i !== index),
        valorTotal: prev.valorTotal - (produto.quantidade * produto.valorUnitario)
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Converte os IDs para string antes de enviar
    const dataToSubmit = {
      ...formData,
      cliente: typeof formData.cliente === 'object' ? formData.cliente._id : formData.cliente,
      prestador: typeof formData.prestador === 'object' ? formData.prestador._id : formData.prestador
    };
    
    onSubmit(dataToSubmit);
  };

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Toaster />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número da OS
          </label>
          <input
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Data
          </label>
          <input
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cliente
          </label>
          <select
            name="cliente"
            value={typeof formData.cliente === 'object' ? formData.cliente._id : formData.cliente}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
          <label className="block text-sm font-medium text-gray-700">
            Prestador
          </label>
          <select
            name="prestador"
            value={typeof formData.prestador === 'object' ? formData.prestador._id : formData.prestador}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição do Serviço
        </label>
        <textarea
          name="descricaoServico"
          value={formData.descricaoServico}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Produtos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descrição do Produto
            </label>
            <input
              type="text"
              value={produtoTemp.descricao}
              onChange={e => setProdutoTemp({
                ...produtoTemp,
                descricao: e.target.value
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Digite a descrição do produto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantidade
            </label>
            <input
              type="number"
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
              value={produtoTemp.valorUnitario}
              onChange={e => setProdutoTemp({
                ...produtoTemp,
                valorUnitario: Number(e.target.value)
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
                    <p className="font-medium">{item.descricao}</p>
                    <p className="text-sm text-gray-500">
                      Qtd: {item.quantidade} x R$ {item.valorUnitario.toFixed(2)} = R$ {(item.quantidade * item.valorUnitario).toFixed(2)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduto(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-2 text-right">
              <p className="text-sm font-medium text-gray-700">
                Total dos Produtos: R$ {formData.produtos.reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Observações
        </label>
        <textarea
          name="observacoes"
          value={formData.observacoes}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

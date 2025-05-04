'use client';

import React, { forwardRef } from 'react';
import { OrdemServico } from '@/types';

interface OSDetailsProps {
  os: OrdemServico;
}

const OSDetails = forwardRef<HTMLDivElement, OSDetailsProps>(({ os }, ref) => {
  const cliente = typeof os.cliente === 'string' ? { nome: os.cliente } : os.cliente;
  const prestador = typeof os.prestador === 'string' ? { nome: os.prestador } : os.prestador;

  return (
    <div ref={ref} className="print-container bg-white p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Ordem de Serviço #{os.numero}</h1>
        <p className="text-gray-600">Data: {new Date(os.dataCriacao).toLocaleDateString('pt-BR')}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Dados do Cliente</h2>
          <p><strong>Nome:</strong> {cliente.nome}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Dados do Prestador</h2>
          <p><strong>Nome:</strong> {prestador.nome}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Descrição</h2>
        <p className="whitespace-pre-wrap">{os.descricao}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Serviços</h2>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Descrição</th>
              <th className="px-4 py-2 text-center">Quantidade</th>
              <th className="px-4 py-2 text-right">Preço Unit.</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {os.servicos.map((servico, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{servico.descricao}</td>
                <td className="px-4 py-2 text-center">{servico.quantidade}</td>
                <td className="px-4 py-2 text-right">
                  {servico.precoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="px-4 py-2 text-right">
                  {servico.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t font-semibold">
              <td colSpan={3} className="px-4 py-2 text-right">Total Serviços:</td>
              <td className="px-4 py-2 text-right">
                {os.valorServicos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {os.produtos.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Produtos</h2>
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Produto</th>
                <th className="px-4 py-2 text-center">Quantidade</th>
                <th className="px-4 py-2 text-right">Preço Unit.</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {os.produtos.map((item, index) => {
                const produto = typeof item.produto === 'string' ? { nome: item.produto } : item.produto;
                return (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{produto.nome}</td>
                    <td className="px-4 py-2 text-center">{item.quantidade}</td>
                    <td className="px-4 py-2 text-right">
                      {item.precoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t font-semibold">
                <td colSpan={3} className="px-4 py-2 text-right">Total Produtos:</td>
                <td className="px-4 py-2 text-right">
                  {os.valorProdutos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className="mt-8">
        <div className="flex justify-between items-center">
          <div>
            <p><strong>Status:</strong> {os.status}</p>
            <p><strong>Data Prevista:</strong> {new Date(os.dataPrevisao).toLocaleDateString('pt-BR')}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">
              Valor Total: {os.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 page-break-avoid">
        <div className="grid grid-cols-2 gap-8">
          <div className="text-center">
            <div className="border-t border-black pt-2">
              <p>Assinatura do Cliente</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-black pt-2">
              <p>Assinatura do Prestador</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

OSDetails.displayName = 'OSDetails';

export default OSDetails;

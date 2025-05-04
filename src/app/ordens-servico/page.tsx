'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { PlusIcon, PrinterIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline';
import OSForm from './components/OSForm';
import OSDetails from './components/OSDetails';
import OSPrint from './components/OSPrint';
import { Cliente, Prestador, Produto, OrdemServico } from '@/types';

export default function OrdensServicoPage() {
  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [selectedOS, setSelectedOS] = useState<OrdemServico | null>(null);
  const [editingOS, setEditingOS] = useState<OrdemServico | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [osResponse, clientesResponse, prestadoresResponse, produtosResponse] = await Promise.all([
        fetch('/api/ordens-servico', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }),
        fetch('/api/clientes', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }),
        fetch('/api/prestadores', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }),
        fetch('/api/produtos', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
      ]);

      if (!osResponse.ok || !clientesResponse.ok || !prestadoresResponse.ok || !produtosResponse.ok) {
        throw new Error('Erro ao buscar dados');
      }

      const [osData, clientesData, prestadoresData, produtosData] = await Promise.all([
        osResponse.json(),
        clientesResponse.json(),
        prestadoresResponse.json(),
        produtosResponse.json()
      ]);

      setOrdensServico(osData);
      setClientes(clientesData);
      setPrestadores(prestadoresData);
      setProdutos(produtosData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/ordens-servico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Erro ao criar ordem de serviço:', error);
    }
  };

  const handleEdit = async (formData: any) => {
    try {
      const response = await fetch('/api/ordens-servico', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, _id: editingOS?._id }),
      });

      if (response.ok) {
        setEditingOS(null);
        fetchData();
      }
    } catch (error) {
      console.error('Erro ao atualizar ordem de serviço:', error);
    }
  };

  const handleStatusChange = async (os: OrdemServico) => {
    try {
      const response = await fetch('/api/ordens-servico', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: os._id,
          status: 'concluido'
        }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handlePrintOS = (os: OrdemServico) => {
    setSelectedOS(os);
  };

  const handleCloseOS = () => {
    setSelectedOS(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5" />
          Nova OS
        </button>
      </div>

      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prestador</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Previsão</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Criação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ordensServico.map((os) => (
              <tr key={os._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {os.numero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {os.cliente?.nome || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {os.prestador?.nome || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(os.dataPrevisao).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    os.status === 'concluido' 
                      ? 'bg-green-100 text-green-800'
                      : os.status === 'cancelado'
                      ? 'bg-red-100 text-red-800'
                      : os.status === 'em_andamento'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {os.status === 'concluido' 
                      ? 'Concluído'
                      : os.status === 'cancelado'
                      ? 'Cancelado'
                      : os.status === 'em_andamento'
                      ? 'Em Andamento'
                      : 'Aberto'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {os.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(os.dataCriacao).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingOS(os)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handlePrintOS(os)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Imprimir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showForm || editingOS) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <OSForm
              clientes={clientes}
              prestadores={prestadores}
              produtos={produtos}
              onSubmit={editingOS ? handleEdit : handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingOS(null);
              }}
              initialData={editingOS || undefined}
              isEditing={!!editingOS}
            />
          </div>
        </div>
      )}

      {selectedOS && (
        <OSPrint ordem={selectedOS} onClose={handleCloseOS} />
      )}
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Sistema de Ordem de Serviço</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Clientes</h2>
          <p className="text-sm text-gray-600">Gerenciar cadastro de clientes</p>
          <Link href="/clientes" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            Acessar →
          </Link>
        </div>

        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Prestadores</h2>
          <p className="text-sm text-gray-600">Gerenciar prestadores de serviço</p>
          <Link href="/prestadores" className="mt-4 inline-block text-green-600 hover:text-green-800">
            Acessar →
          </Link>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Produtos</h2>
          <p className="text-sm text-gray-600">Controle de estoque</p>
          <Link href="/produtos" className="mt-4 inline-block text-yellow-600 hover:text-yellow-800">
            Acessar →
          </Link>
        </div>

        <div className="bg-purple-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Ordens de Serviço</h2>
          <p className="text-sm text-gray-600">Gerenciar ordens de serviço</p>
          <Link href="/ordens-servico" className="mt-4 inline-block text-purple-600 hover:text-purple-800">
            Acessar →
          </Link>
        </div>
      </div>
    </div>
  );
}

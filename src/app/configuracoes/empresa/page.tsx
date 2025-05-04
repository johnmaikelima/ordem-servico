import React from 'react';
import EmpresaForm from './components/EmpresaForm';

export default function EmpresaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Configurações da Empresa</h1>
      <EmpresaForm />
    </div>
  );
}

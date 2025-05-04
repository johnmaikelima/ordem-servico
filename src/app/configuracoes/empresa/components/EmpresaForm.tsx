'use client';

import React, { useState, useEffect } from 'react';
import { Empresa } from '@/types/empresa';
import Image from 'next/image';

export default function EmpresaForm() {
  const [empresa, setEmpresa] = useState<Empresa>({
    nome: '',
    razaoSocial: '',
    cnpj: '',
    telefone: '',
    email: '',
    endereco: {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    }
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchEmpresa();
  }, []);

  const fetchEmpresa = async () => {
    try {
      const response = await fetch('/api/empresa');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setEmpresa(data);
          if (data.logo) {
            setLogoPreview(data.logo);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados da empresa:', error);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let logoUrl = empresa.logo;

      // Se houver um novo logo, faz o upload
      if (logo) {
        const formData = new FormData();
        formData.append('file', logo);
        
        // Aqui você precisará implementar uma rota para upload de arquivos
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          logoUrl = url;
        }
      }

      const empresaData = {
        ...empresa,
        logo: logoUrl
      };

      const method = empresa._id ? 'PUT' : 'POST';
      const response = await fetch('/api/empresa', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(empresaData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Dados salvos com sucesso!' });
        if (!empresa._id) {
          fetchEmpresa(); // Recarrega os dados após criar
        }
      } else {
        throw new Error(data.error || 'Erro ao salvar dados');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar os dados. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      {message.text && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Logo da Empresa
        </label>
        <div className="flex items-center space-x-4">
          {logoPreview && (
            <div className="relative w-32 h-32">
              <Image
                src={logoPreview}
                alt="Logo da empresa"
                fill
                className="object-contain"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nome Fantasia
          </label>
          <input
            type="text"
            value={empresa.nome}
            onChange={(e) => setEmpresa({ ...empresa, nome: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Razão Social
          </label>
          <input
            type="text"
            value={empresa.razaoSocial}
            onChange={(e) => setEmpresa({ ...empresa, razaoSocial: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            CNPJ
          </label>
          <input
            type="text"
            value={empresa.cnpj}
            onChange={(e) => setEmpresa({ ...empresa, cnpj: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Telefone
          </label>
          <input
            type="text"
            value={empresa.telefone}
            onChange={(e) => setEmpresa({ ...empresa, telefone: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            value={empresa.email}
            onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Endereço</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Rua
            </label>
            <input
              type="text"
              value={empresa.endereco.rua}
              onChange={(e) => setEmpresa({
                ...empresa,
                endereco: { ...empresa.endereco, rua: e.target.value }
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Número
            </label>
            <input
              type="text"
              value={empresa.endereco.numero}
              onChange={(e) => setEmpresa({
                ...empresa,
                endereco: { ...empresa.endereco, numero: e.target.value }
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Complemento
            </label>
            <input
              type="text"
              value={empresa.endereco.complemento}
              onChange={(e) => setEmpresa({
                ...empresa,
                endereco: { ...empresa.endereco, complemento: e.target.value }
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Bairro
            </label>
            <input
              type="text"
              value={empresa.endereco.bairro}
              onChange={(e) => setEmpresa({
                ...empresa,
                endereco: { ...empresa.endereco, bairro: e.target.value }
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Cidade
            </label>
            <input
              type="text"
              value={empresa.endereco.cidade}
              onChange={(e) => setEmpresa({
                ...empresa,
                endereco: { ...empresa.endereco, cidade: e.target.value }
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Estado
            </label>
            <input
              type="text"
              value={empresa.endereco.estado}
              onChange={(e) => setEmpresa({
                ...empresa,
                endereco: { ...empresa.endereco, estado: e.target.value }
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              CEP
            </label>
            <input
              type="text"
              value={empresa.endereco.cep}
              onChange={(e) => setEmpresa({
                ...empresa,
                endereco: { ...empresa.endereco, cep: e.target.value }
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}

import React from 'react';
import { OrdemServico } from '@/types/';
import { Empresa } from '@/types/empresa';

interface OSPrintProps {
  ordem: OrdemServico;
  onClose: () => void;
}

const OSPrint: React.FC<OSPrintProps> = ({ ordem, onClose }) => {
  const handlePrint = async () => {
    try {
      // Busca os dados da empresa
      const response = await fetch('/api/empresa');
      const empresa: Empresa = await response.json();

      // Abre uma nova janela com apenas o conteúdo da OS
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Ordem de Serviço #${ordem.numero}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 20mm;
                  color: #333;
                }
                .header {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 2rem;
                }
                .company-logo {
                  max-width: 200px;
                  max-height: 100px;
                  object-fit: contain;
                }
                .title {
                  font-size: 24px;
                  font-weight: bold;
                  color: #1a1a1a;
                }
                .number {
                  font-size: 20px;
                  color: #2563eb;
                  margin-top: 4px;
                }
                .company {
                  text-align: right;
                }
                .info-box {
                  border: 1px solid #e5e7eb;
                  border-radius: 8px;
                  padding: 1rem;
                  margin-bottom: 1rem;
                }
                .grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 1rem;
                }
                .label {
                  font-weight: bold;
                  margin-right: 8px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 1rem 0;
                }
                th, td {
                  border: 1px solid #e5e7eb;
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f9fafb;
                }
                .totals {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  gap: 1rem;
                  margin: 1rem 0;
                }
                .signatures {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 2rem;
                  margin-top: 3rem;
                }
                .signature {
                  text-align: center;
                }
                .signature-line {
                  border-top: 1px solid #333;
                  padding-top: 8px;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div>
                  ${empresa.logo ? `<img src="${empresa.logo}" alt="${empresa.nome}" class="company-logo" />` : ''}
                  <div class="title">ORDEM DE SERVIÇO</div>
                  <div class="number">#${ordem.numero}</div>
                </div>
                <div class="company">
                  <div style="font-size: 20px; font-weight: bold;">${empresa.nome}</div>
                  <div>${empresa.razaoSocial}</div>
                  <div>CNPJ: ${empresa.cnpj}</div>
                  <div>Tel: ${empresa.telefone}</div>
                  <div>${empresa.email}</div>
                  <div style="margin-top: 4px; font-size: 12px;">
                    ${empresa.endereco.rua}, ${empresa.endereco.numero}
                    ${empresa.endereco.complemento ? ` - ${empresa.endereco.complemento}` : ''}
                    <br />
                    ${empresa.endereco.bairro} - ${empresa.endereco.cidade}/${empresa.endereco.estado}
                  </div>
                </div>
              </div>

              <div class="info-box">
                <div class="grid">
                  <div>
                    <div class="label">Cliente</div>
                    <div style="font-size: 18px; font-weight: bold;">
                      ${typeof ordem.cliente === 'object' && ordem.cliente ? ordem.cliente.nome : ''}
                    </div>
                    <div style="margin-top: 4px; font-size: 14px;">
                      ${typeof ordem.cliente === 'object' && ordem.cliente ? `
                        CPF/CNPJ: ${ordem.cliente.cpfCnpj}<br />
                        Tel: ${ordem.cliente.telefone}<br />
                        Email: ${ordem.cliente.email}
                      ` : ''}
                    </div>
                  </div>
                  <div>
                    <div class="label">Endereço</div>
                    <div style="font-size: 14px;">
                      ${typeof ordem.cliente === 'object' && ordem.cliente ? `
                        ${ordem.cliente.endereco.rua}, ${ordem.cliente.endereco.numero}
                        ${ordem.cliente.endereco.complemento ? ` - ${ordem.cliente.endereco.complemento}` : ''}
                        <br />
                        ${ordem.cliente.endereco.bairro} - ${ordem.cliente.endereco.cidade}/${ordem.cliente.endereco.estado}
                      ` : ''}
                    </div>
                  </div>
                </div>
              </div>

              <div class="info-box">
                <div class="grid">
                  <div>
                    <div class="label">Prestador</div>
                    <div style="font-size: 18px; font-weight: bold;">
                      ${typeof ordem.prestador === 'object' && ordem.prestador ? ordem.prestador.nome : ''}
                    </div>
                    <div style="margin-top: 4px; font-size: 14px;">
                      ${typeof ordem.prestador === 'object' && ordem.prestador ? `
                        CPF/CNPJ: ${ordem.prestador.cpfCnpj}<br />
                        Tel: ${ordem.prestador.telefone}<br />
                        Email: ${ordem.prestador.email}
                      ` : ''}
                    </div>
                  </div>
                  <div>
                    <div class="label">Informações</div>
                    <div style="font-size: 14px;">
                      Data de Criação: ${new Date(ordem.dataCriacao).toLocaleDateString('pt-BR')}<br />
                      Data Prevista: ${new Date(ordem.dataPrevisao).toLocaleDateString('pt-BR')}<br />
                      Status: ${ordem.status}
                    </div>
                  </div>
                </div>
              </div>

              <div class="info-box">
                <div class="label">Descrição</div>
                <div style="margin-top: 8px; white-space: pre-wrap;">${ordem.descricao}</div>
              </div>

              ${ordem.servicos.length > 0 ? `
                <div class="info-box">
                  <div class="label">Serviços</div>
                  <table>
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th style="text-align: right">Qtd</th>
                        <th style="text-align: right">Valor Unit.</th>
                        <th style="text-align: right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${ordem.servicos.map(servico => `
                        <tr>
                          <td>${servico.descricao}</td>
                          <td style="text-align: right">${servico.quantidade}</td>
                          <td style="text-align: right">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.precoUnitario)}</td>
                          <td style="text-align: right">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.total)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              ` : ''}

              ${ordem.produtos.length > 0 ? `
                <div class="info-box">
                  <div class="label">Produtos</div>
                  <table>
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th style="text-align: right">Qtd</th>
                        <th style="text-align: right">Valor Unit.</th>
                        <th style="text-align: right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${ordem.produtos.map(item => `
                        <tr>
                          <td>${typeof item.produto === 'object' && item.produto ? item.produto.nome : ''}</td>
                          <td style="text-align: right">${item.quantidade}</td>
                          <td style="text-align: right">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.precoUnitario)}</td>
                          <td style="text-align: right">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              ` : ''}

              <div class="info-box">
                <div class="totals">
                  <div>
                    <div>Total Serviços</div>
                    <div style="font-size: 18px; font-weight: bold;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ordem.valorServicos)}</div>
                  </div>
                  <div>
                    <div>Total Produtos</div>
                    <div style="font-size: 18px; font-weight: bold;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ordem.valorProdutos)}</div>
                  </div>
                  <div>
                    <div>Valor Total</div>
                    <div style="font-size: 20px; font-weight: bold; color: #2563eb">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ordem.valorTotal)}</div>
                  </div>
                </div>
              </div>

              <div class="signatures">
                <div class="signature">
                  <div class="signature-line">
                    <div style="color: #666; font-size: 14px;">Técnico Responsável</div>
                    <div style="font-weight: bold; margin-top: 4px;">${typeof ordem.prestador === 'object' ? ordem.prestador.nome : ''}</div>
                  </div>
                </div>
                <div class="signature">
                  <div class="signature-line">
                    <div style="color: #666; font-size: 14px;">Cliente</div>
                    <div style="font-weight: bold; margin-top: 4px;">${typeof ordem.cliente === 'object' ? ordem.cliente.nome : ''}</div>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        // Espera um momento para garantir que os estilos foram carregados
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    } catch (error) {
      console.error('Erro ao buscar dados da empresa:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-[800px] max-h-[90vh] overflow-y-auto">
        {/* Botões de ação */}
        <div className="p-4 flex justify-end gap-2 border-b">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Fechar
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            Imprimir
          </button>
        </div>

        {/* Preview da OS */}
        <div className="p-8">
          <div className="text-4xl font-bold text-gray-800 mb-1">
            ORDEM DE SERVIÇO #{ordem.numero}
          </div>
          <div className="text-gray-600 mt-4">
            Clique em "Imprimir" para gerar a versão para impressão.
          </div>
        </div>
      </div>
    </div>
  );
};

export default OSPrint;

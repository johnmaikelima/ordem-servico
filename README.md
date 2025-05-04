# Sistema de Ordens de Serviço

Sistema para gerenciamento de ordens de serviço, clientes, prestadores e produtos.

## Tecnologias Utilizadas

- Next.js 13
- TypeScript
- MongoDB
- TailwindCSS

## Configuração do Ambiente

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/ordem-servico.git
cd ordem-servico
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
- Copie o arquivo `.env.example` para `.env.local`
```bash
cp .env.example .env.local
```
- Edite o arquivo `.env.local` com suas configurações:
  - `MONGODB_URI`: URL de conexão com o MongoDB

4. Execute o projeto em desenvolvimento
```bash
npm run dev
```

5. Para build de produção
```bash
npm run build
npm start
```

## Funcionalidades

- Cadastro e gerenciamento de clientes
- Cadastro e gerenciamento de prestadores de serviço
- Cadastro e gerenciamento de produtos
- Criação e gerenciamento de ordens de serviço
- Impressão de ordens de serviço
- Controle de status das ordens
- Cálculo automático de valores

## Estrutura do Projeto

- `/src/app`: Páginas e componentes da aplicação
- `/src/app/api`: Rotas da API
- `/src/types`: Definições de tipos TypeScript
- `/src/lib`: Utilitários e configurações

# family-assist (API Backend) 🏡

> Uma API RESTful robusta e multi-tenant desenvolvida para o gerenciamento de assistentes familiares, permitindo o controle centralizado de tarefas, finanças, eventos e permissões baseadas em cargos.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias e ferramentas:

* **Node.js** & **Express**: Construção da API e rotas HTTP.
* **Sequelize ORM**: Mapeamento objeto-relacional para modelagem do banco de dados.
* **PostgreSQL**: Banco de dados relacional.
* **JWT (JSON Web Tokens)**: Autenticação segura de sessões.
* **Bcrypt.js**: Criptografia de senhas.

---

## 📁 Estrutura do Projeto

A arquitetura do projeto foi organizada em camadas para garantir escalabilidade e separação de responsabilidades:

```text
family-assist/
│
├── src/
│   ├── config/          # Configurações de conexão com o banco de dados (Sequelize)
│   ├── controllers/     # Regras de negócio e lógica dos endpoints
│   ├── helpers/         # Funções utilitárias (tokens, datas, etc.)
│   ├── middlewares/     # Interceptadores de segurança (autenticação e verificação de cargos)
│   ├── models/          # Definição dos modelos/tabelas do banco de dados
│   ├── routes/          # Definição das rotas da API por domínio
│   ├── app.js           # Configuração do Express e middlewares globais
│   └── server.js        # Inicialização do servidor HTTP
│
├── .env.example         # Exemplo de variáveis de ambiente
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

---

## 🔒 Arquitetura de Segurança e Permissões

O sistema implementa controle de acesso baseado em papéis (**RBAC - Role-Based Access Control**) através de middlewares dedicados:
* **`verifyToken`**: Valida o token JWT em rotas protegidas.
* **`isAdmin`**: Restringe ações críticas exclusivas para administradores da família.
* **`notChild`**: Impede que contas infantis executem ações restritas a adultos e administradores.

---

## ⚙️ Funcionalidades e Rotas Principais

* **Usuários (`/user`)**: Autenticação (`/login`), cadastro de novos membros, listagem e gestão de perfis.
* **Família (`/family`)**: Gestão de núcleos familiares (Multi-tenant).
* **Tarefas (`/task`)**: Criação e acompanhamento de tarefas domésticas.
* **Finanças (`/bill`)**: Controle de contas e despesas da casa.
* **Eventos (`/event`)**: Gestão do calendário e compromissos da família.
* **Fechamento de Mês (`/month`)**: Resumos e auditoria financeira mensal.

---

## 📦 Como Executar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter o **Node.js** e o **PostgreSQL** instalados na sua máquina.

### Passos:

1. Clone o repositório:
   ```bash
   git clone [https://github.com/seu-usuario/family-assist.git](https://github.com/seu-usuario/family-assist.git)
   cd family-assist/family-assist
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo de ambiente:
   * Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`.
   * Preencha as credenciais do seu banco de dados PostgreSQL e a chave secreta do JWT (`JWT_SECRET`).

4. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run start
   ```
   *(O servidor rodará por padrão na porta `3000`)*

---

## ✒️ Autor

Desenvolvido por **Dudu** 🚀

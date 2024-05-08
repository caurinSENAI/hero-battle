# Sistema de Cadastro de Usuários

Este projeto é um sistema simples de cadastro de usuários utilizando Node.js, Express.js e PostgreSQL.

## Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL

## Instalação e Configuração

1. Clone o repositório:

   ```bash
   git clone https://github.com/caurinSENAI/hero-battle.git

   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

# Uso

1. Execute o servidor:

   ```bash
   npm run dev

   ```

2. Acesse o sistema em `http://localhost:7777/heroes` ou `http://localhost:777/battles`.

#Rotas

- GET /heroes - Retorna todos os heróis cadastrados.
- GET /heroes/:id - Retorna um herói específico.
- GET /heroes/nome/:name - Retorna um herói específico pelo nome.
- POST /heroes - Cadastra um novo herói.
- PUT /heroes/:id - Atualiza um herói específico.
- DELETE /heroes/:id - Deleta um herói específico.

- GET /battles - Retorna todas as batalhas cadastradas.q
- POST /battles - Cadastra uma nova batalha.

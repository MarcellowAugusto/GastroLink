\# GastroLink 🍽️



\### Conectando Restaurantes e Influenciadores



O \*\*GastroLink\*\* é uma aplicação web desenvolvida com o objetivo de conectar restaurantes e influenciadores digitais, facilitando a criação e o gerenciamento de parcerias para divulgação de estabelecimentos.



A plataforma permite que restaurantes apresentem seus negócios e que influenciadores encontrem oportunidades de parceria, enviem propostas e acompanhem suas solicitações.



O projeto foi desenvolvido como parte de um trabalho acadêmico do curso de Análise e Desenvolvimento de Sistemas.



\---



\## 🚀 Funcionalidades



\- Cadastro e login de usuários.

\- Autenticação utilizando JWT.

\- Criptografia de senhas com BCrypt.

\- Perfis de acesso para Restaurantes e Influenciadores.

\- Visualização de perfis e informações dos usuários.

\- Envio e gerenciamento de propostas de parceria.

\- Aceitação e recusa de propostas.

\- Acompanhamento do status das propostas.

\- Notificações relacionadas às movimentações das propostas.

\- Disponibilização de e-mail de contato após a aceitação de uma parceria.



\## 🛠️ Tecnologias utilizadas



\### Back-end

\- C#

\- ASP.NET Core Web API

\- Entity Framework Core

\- SQL Server

\- JWT (JSON Web Token)

\- BCrypt

\- Swagger



\### Front-end

\- HTML5

\- CSS3

\- JavaScript



\### Ferramentas

\- Visual Studio

\- Visual Studio Code

\- SQL Server

\- Postman

\- Git e GitHub



\## 📁 Estrutura do projeto



```text

GastroLink/

│

├── BackEnd/

│   ├── Controllers/

│   ├── Data/

│   ├── Dtos/

│   ├── Entites/

│   ├── Enum/

│   ├── Interfaces/

│   ├── Migrations/

│   ├── Properties/

│   ├── Services/

│   ├── Program.cs

│   ├── appsettings.json

│   └── GastroLinkApi-2.0.csproj

│

├── FrontEnd/

│   ├── css/

│   │   └── style.css

│   ├── js/

│   │   ├── auth.js

│   │   └── main.js

│   └── index.html

│

├── GastroLinkApi-2.0.slnx

├── .gitignore

└── README.md

```



\## ⚙️ Como executar o projeto



\### 1. Pré-requisitos



\- .NET 10 SDK

\- SQL Server

\- Visual Studio ou outra IDE compatível

\- Navegador web



\### 2. Configuração do banco de dados



Configure a conexão com o SQL Server no arquivo `BackEnd/appsettings.json`.



\### 3. Configuração do JWT



Configure as propriedades de autenticação no arquivo `appsettings.json`, utilizando a seção `JwtSettings`:



\- `Issuer`

\- `Audience`

\- `Key`



\*\*Importante:\*\* utilize valores próprios no ambiente local. Não publique chaves JWT ou credenciais reais.



\### 4. Executar o back-end



Na pasta principal do projeto, execute:



```bash

dotnet restore

dotnet build GastroLinkApi-2.0.slnx

dotnet run --project BackEnd/GastroLinkApi-2.0.csproj

```



\### 5. Executar o front-end



Abra o arquivo `FrontEnd/index.html` no navegador ou utilize uma extensão como Live Server no Visual Studio Code.



\## 🎯 Objetivo acadêmico



O GastroLink foi desenvolvido com o propósito de aplicar conhecimentos de desenvolvimento web, programação back-end, integração entre sistemas, autenticação de usuários, organização de código e persistência de dados.



O projeto também busca apresentar uma solução digital para aproximar restaurantes e influenciadores, facilitando o contato e a criação de parcerias.



\---



\## 👥 Integrantes do grupo



\- Ana Carolina Roveda da Silva

\- João Garcia Neto

\- Marcelo Augusto Tecla da Cunha

\- Rodrigo Araújo Leite Catão

\- Stephany Sousa Santos

\- Yasumiti Nakahara



\---



\*\*Projeto acadêmico — Análise e Desenvolvimento de Sistemas.\*\*


# SINAN MCP Explorer

Projeto desenvolvido como uma personalização do desafio **Construindo seu Primeiro Produto com um Agente de IA**, da Digital Innovation One (DIO), utilizando o **IBM Bob** como agente de apoio ao desenvolvimento.

## 1. Sobre o projeto

A proposta original do desafio apresenta o **Geo-Explorer**, uma aplicação utilizada para explorar trilhas de aprendizagem, criar desafios e demonstrar a construção de ferramentas acessíveis por um agente.

Nesta implementação, os conceitos apresentados durante o desafio foram adaptados para um contexto de **Ciência de Dados**, por meio da construção de um servidor **Model Context Protocol (MCP)** capaz de intermediar a comunicação entre um agente e uma fonte externa de dados hospedada no **Appwrite Cloud**.

O objetivo não é disponibilizar os dados ou resultados do trabalho acadêmico que originou o experimento, mas demonstrar a arquitetura e o código necessários para integrar:

- ambiente local de desenvolvimento;
- IBM Bob;
- Model Context Protocol (MCP);
- Node.js/TypeScript;
- Appwrite Cloud;
- Git;
- GitHub.

> **Privacidade:** dados acadêmicos, bases utilizadas na pesquisa e credenciais de acesso não são disponibilizados neste repositório.

---

## 2. Arquitetura da solução

A solução foi organizada em camadas independentes:

```text
                    ┌─────────────────────┐
                    │       Usuária       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      IBM Bob        │
                    │   Agente / Cliente  │
                    └──────────┬──────────┘
                               │
                               │ MCP / stdio
                               ▼
                    ┌─────────────────────┐
                    │ Servidor MCP local  │
                    │ mcp-appwrite-sinan  │
                    │ TypeScript/Node.js  │
                    └──────────┬──────────┘
                               │
                               │ node-appwrite
                               │ HTTPS / API
                               ▼
                    ┌─────────────────────┐
                    │   Appwrite Cloud    │
                    │    Banco de dados   │
                    └─────────────────────┘


           Versionamento do código:

                    Máquina local
                         │
                         │ Git
                         ▼
                      GitHub
```

Essa separação é importante porque o **IBM Bob não precisa acessar diretamente o banco de dados**.

O agente recebe a solicitação da pessoa usuária e pode selecionar uma ferramenta disponibilizada pelo servidor MCP. O servidor executa a operação necessária e utiliza o SDK do Appwrite para acessar o serviço externo.

O GitHub, por sua vez, é utilizado para **versionamento, documentação e publicação do código**, não para executar o servidor MCP.

---

## 3. Papel do IBM Bob no desenvolvimento

O IBM Bob foi utilizado dentro do ambiente local de desenvolvimento como agente de apoio à construção da solução.

Durante o desenvolvimento, o agente auxiliou na organização da estrutura do projeto, implementação do servidor MCP, definição das ferramentas, configuração das dependências e documentação da integração.

A arquitetura resultante separa quatro responsabilidades:

```text
IBM Bob
   │
   │ seleciona/utiliza uma ferramenta
   ▼
Servidor MCP
   │
   │ executa a operação
   ▼
Appwrite SDK/API
   │
   │ acessa a fonte externa
   ▼
Appwrite Cloud
```

Assim, o agente não contém a lógica de acesso ao banco. Essa responsabilidade pertence ao servidor MCP.

---

## 4. Servidor MCP local

O servidor foi implementado em **TypeScript/Node.js** utilizando o SDK do Model Context Protocol.

O componente principal encontra-se em:

```text
mcp-appwrite-sinan/
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

O servidor é inicializado por meio de:

```ts
const server = new McpServer({
  name: "appwrite-sinan",
  version: "1.0.0",
});
```

Para a comunicação com o cliente MCP é utilizado:

```ts
const transport = new StdioServerTransport();
await server.connect(transport);
```

Portanto, nesta implementação, o servidor MCP é executado como um **processo local Node.js**, e a comunicação com o cliente ocorre utilizando **standard input/output (stdio)**.

Conceitualmente:

```text
IBM Bob
   │
   │ MCP / stdio
   ▼
processo Node.js
   │
   ▼
mcp-appwrite-sinan
```

---

## 5. Ferramentas MCP implementadas

As ferramentas são registradas no servidor por meio de `server.registerTool()`.

| Ferramenta | Função |
|---|---|
| `listar_colecoes` | Lista as coleções disponíveis no banco |
| `consultar_documentos` | Consulta documentos utilizando filtros |
| `buscar_documento` | Recupera um documento pelo identificador |
| `contar_documentos` | Realiza contagens de registros |
| `criar_documento` | Insere um novo documento |
| `atualizar_documento` | Atualiza campos de um documento existente |

Os parâmetros recebidos pelas ferramentas são validados utilizando **Zod**.

Por exemplo, uma consulta pode receber informações como:

```text
colecao_id
filtros
limite
offset
```

O servidor converte esses parâmetros para operações compatíveis com o Appwrite.

---

## 6. Integração com o Appwrite Cloud

O servidor MCP utiliza o pacote `node-appwrite` para realizar a comunicação com o Appwrite Cloud.

A conexão é configurada a partir de variáveis de ambiente:

| Variável | Finalidade |
|---|---|
| `APPWRITE_ENDPOINT` | Endpoint da API |
| `APPWRITE_PROJECT_ID` | Identificador do projeto |
| `APPWRITE_API_KEY` | Credencial utilizada pelo servidor |
| `APPWRITE_DATABASE_ID` | Identificador do banco |

A inicialização do cliente ocorre no servidor:

```ts
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);
```

Em seguida, o servidor utiliza o cliente de banco de dados do Appwrite para executar as operações solicitadas pelas ferramentas MCP.

O fluxo é:

```text
Ferramenta MCP
      │
      ▼
node-appwrite
      │
      ▼
Appwrite API
      │
      ▼
Appwrite Cloud
```

---

## 7. Fluxo completo de uma solicitação

Uma interação ocorre conceitualmente da seguinte maneira:

```text
1. A pessoa usuária envia uma solicitação ao IBM Bob.

2. O agente interpreta a solicitação.

3. O agente identifica uma ferramenta MCP compatível.

4. A ferramenta é chamada com os parâmetros necessários.

5. O servidor MCP valida os parâmetros.

6. O servidor utiliza o SDK node-appwrite.

7. A requisição é enviada ao Appwrite Cloud.

8. O Appwrite executa a operação sobre a fonte de dados.

9. O resultado retorna ao servidor MCP.

10. O servidor devolve o resultado ao cliente MCP.

11. O agente apresenta o resultado à pessoa usuária.
```

Essa arquitetura tornou mais clara a diferença entre:

```text
Agente ≠ Ferramenta ≠ Fonte de dados
```

---

## 8. Instalação e build

Após clonar o repositório, acesse a pasta do projeto:

```bash
cd mcp-appwrite-sinan
```

Instale as dependências:

```bash
npm install
```

Compile o projeto:

```bash
npm run build
```

O processo de build gera o JavaScript executável utilizado pelo cliente MCP.

---

## 9. Registro do servidor no cliente MCP

Um cliente compatível com MCP pode iniciar o servidor local por meio de uma configuração semelhante a:

```json
{
  "mcpServers": {
    "appwrite-sinan": {
      "command": "node",
      "args": [
        "CAMINHO_LOCAL/mcp-appwrite-sinan/build/index.js"
      ],
      "env": {
        "APPWRITE_ENDPOINT": "https://cloud.appwrite.io/v1",
        "APPWRITE_PROJECT_ID": "SEU_PROJECT_ID",
        "APPWRITE_API_KEY": "SUA_API_KEY",
        "APPWRITE_DATABASE_ID": "SEU_DATABASE_ID"
      }
    }
  }
}
```

O caminho de `build/index.js` depende do diretório no qual o projeto foi instalado.

Nenhuma credencial real é disponibilizada neste repositório.

---

## 10. Exemplos de interação

Com o servidor configurado, o agente pode receber solicitações como:

```text
Liste as coleções disponíveis.

Quantos registros existem na coleção selecionada?

Mostre os primeiros 10 registros.

Consulte um registro utilizando seu identificador.
```

A partir da solicitação, o agente pode selecionar a ferramenta MCP apropriada.

---

## 11. Git e GitHub

O desenvolvimento ocorre no ambiente local.

O **Git** é responsável pelo controle de versão, enquanto o **GitHub** mantém o código e a documentação do projeto.

```text
Código local
    │
    │ git add
    │ git commit
    │ git push
    ▼
GitHub
```

O GitHub não armazena as credenciais utilizadas para acessar o Appwrite e não participa da execução das consultas.

---

## 12. Segurança e privacidade

Uma preocupação importante durante o desenvolvimento foi separar **código público** de **configuração privada**.

Não devem ser versionados:

- API Keys;
- tokens;
- senhas;
- arquivos `.env`;
- bases acadêmicas;
- informações sensíveis.

O repositório utiliza placeholders como:

```text
APPWRITE_PROJECT_ID=SEU_PROJECT_ID
APPWRITE_API_KEY=SUA_API_KEY
APPWRITE_DATABASE_ID=SEU_DATABASE_ID
```

Arquivos locais contendo informações sensíveis devem ser excluídos do controle de versão por meio do `.gitignore`.

---

## 13. Personalização do desafio DIO

A proposta original do desafio utiliza o **Geo-Explorer**.

Nesta implementação, optei por não reproduzir apenas o exemplo apresentado nas aulas. Os conceitos foram transferidos para um cenário relacionado à minha experiência em Ciência de Dados.

A personalização permitiu praticar:

- desenvolvimento assistido por agente de IA;
- arquitetura baseada em ferramentas;
- Model Context Protocol;
- comunicação via stdio;
- TypeScript e Node.js;
- validação de parâmetros;
- integração com APIs;
- Appwrite Cloud;
- Git e GitHub;
- gerenciamento de variáveis de ambiente;
- segurança de credenciais;
- documentação técnica.

---

## 14. Tecnologias utilizadas

- IBM Bob
- Model Context Protocol (MCP)
- TypeScript
- Node.js
- `@modelcontextprotocol/server`
- `node-appwrite`
- Zod
- Appwrite Cloud
- Git
- GitHub

---

## 15. O que aprendi

O principal aprendizado foi compreender que uma aplicação baseada em agentes não precisa concentrar todas as responsabilidades no modelo de linguagem.

O agente pode interpretar uma solicitação e selecionar ferramentas, enquanto o servidor MCP encapsula a lógica necessária para acessar sistemas externos.

Neste projeto, a arquitetura pode ser resumida como:

```text
Pessoa usuária
      ↓
Agente
      ↓
MCP
      ↓
SDK/API
      ↓
Fonte de dados
```

Também foi possível compreender melhor a diferença entre o ambiente de desenvolvimento local, a execução do servidor MCP, o serviço de dados em nuvem e o repositório utilizado para versionamento.

---

## 16. Status do projeto

Projeto experimental desenvolvido para fins **educacionais e de portfólio**, como personalização de um desafio da DIO.

A base acadêmica e as credenciais utilizadas durante o desenvolvimento não fazem parte da publicação.

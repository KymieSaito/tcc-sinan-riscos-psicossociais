Utilizei o IBM Bob para desenvolver e configurar, localmente, um servidor baseado no Model Context Protocol (MCP), criando uma camada de integração entre um agente de IA e dados do SINAN armazenados no Appwrite Cloud. O servidor expõe ferramentas controladas para consulta e manipulação dos documentos, utilizando o SDK do Appwrite e mantendo credenciais e configurações separadas do código por meio de variáveis de ambiente.
# SINAN MCP Explorer

Projeto desenvolvido como personalização do desafio **Construindo seu Primeiro Produto com um Agente de IA**, da **Digital Innovation One (DIO)**, utilizando o **IBM Bob** como agente de apoio ao desenvolvimento.

O projeto demonstra a construção de uma arquitetura que integra **Agentes de IA, Model Context Protocol (MCP), Engenharia de Dados, APIs, banco de dados em nuvem, autenticação, Git e GitHub**, mantendo separação entre o código demonstrativo e os dados utilizados no trabalho acadêmico que motivou o estudo.

---

## 1. Visão geral

O desafio original da DIO apresenta o **Geo-Explorer**, utilizado para demonstrar a construção de um produto com apoio de um agente de IA e a disponibilização de funcionalidades por meio de MCP.

Nesta implementação, o conceito foi adaptado para um cenário de **Ciência e Engenharia de Dados**.

Foi desenvolvido um servidor MCP denominado:

```text
mcp-appwrite-sinan
```

Sua função é criar uma camada padronizada entre o agente de IA e uma fonte estruturada de dados.

A arquitetura integra:

```text
IBM Bob
     ↓
MCP
     ↓
Node.js / TypeScript
     ↓
Appwrite SDK
     ↓
API HTTPS
     ↓
Appwrite Cloud
     ↓
Banco de dados
```

O projeto também utiliza **Git e GitHub** para versionamento, documentação e disponibilização do código.

---

# 2. Objetivo

O objetivo técnico foi experimentar como um agente de IA pode acessar funcionalidades externas sem incorporar diretamente a lógica de acesso a dados.

Em vez de fornecer ao modelo acesso direto ao banco, foi criada uma camada intermediária responsável por:

- definir ferramentas;
- validar parâmetros;
- controlar operações permitidas;
- acessar a API externa;
- recuperar dados;
- retornar respostas estruturadas ao agente.

Essa camada é o **servidor MCP**.

A solução permite estudar, em um único projeto, conceitos de:

- Inteligência Artificial Generativa;
- agentes de IA;
- Model Context Protocol;
- arquitetura cliente-servidor;
- Engenharia de Dados;
- APIs;
- autenticação;
- gerenciamento de segredos;
- bancos de dados em nuvem;
- TypeScript;
- Node.js;
- Git/GitHub.

---

# 3. Arquitetura geral

A arquitetura pode ser representada da seguinte forma:

```text
┌─────────────────────────────────────────────────────┐
│                    CAMADA DE IA                     │
│                                                     │
│                     IBM Bob                         │
│                Agente / MCP Client                  │
└───────────────────────┬─────────────────────────────┘
                        │
                        │ MCP
                        │ JSON-RPC
                        │ STDIO
                        ▼
┌─────────────────────────────────────────────────────┐
│                CAMADA DE INTEGRAÇÃO                 │
│                                                     │
│              mcp-appwrite-sinan                     │
│                                                     │
│          TypeScript + Node.js + Zod                 │
│                                                     │
│     Tools MCP / validação / controle de acesso      │
└───────────────────────┬─────────────────────────────┘
                        │
                        │ node-appwrite
                        │ HTTPS
                        ▼
┌─────────────────────────────────────────────────────┐
│                    CAMADA API                       │
│                                                     │
│                  Appwrite API                       │
│                                                     │
│       autenticação por Project ID + API Key         │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                    CAMADA DE DADOS                  │
│                                                     │
│                 Appwrite Cloud                      │
│                                                     │
│           Banco / coleções / documentos             │
└─────────────────────────────────────────────────────┘
```

Em paralelo existe uma camada de versionamento:

```text
Código local
     │
     │ Git
     ▼
Repositório Git
     │
     │ push
     ▼
GitHub
```

O GitHub não funciona como banco de dados nem como servidor MCP.

Sua responsabilidade é armazenar e versionar o **código e a documentação pública do projeto**.

---

# 4. Papel do IBM Bob

O **IBM Bob** foi utilizado como agente de desenvolvimento no ambiente local.

Ele auxiliou na transformação dos requisitos em componentes técnicos, incluindo:

- estruturação do projeto;
- organização dos arquivos;
- implementação do servidor MCP;
- definição das ferramentas;
- integração com Appwrite;
- configuração das dependências;
- tratamento de parâmetros;
- documentação;
- apoio ao processo de desenvolvimento.

Além de atuar como assistente de desenvolvimento, o Bob pode atuar como **cliente MCP**.

Nesse cenário:

```text
Pessoa usuária
      ↓
IBM Bob
      ↓
MCP Tool
      ↓
Servidor MCP
```

O Bob interpreta a solicitação e pode selecionar uma ferramenta registrada pelo servidor.

O agente, portanto, não precisa conhecer diretamente os detalhes da API ou da estrutura interna do banco.

---

# 5. Model Context Protocol — MCP

O **Model Context Protocol (MCP)** fornece uma interface padronizada para que sistemas de IA possam utilizar ferramentas e serviços externos.

Neste projeto, a separação conceitual é:

```text
LLM / Agente
      │
      ▼
MCP Client
      │
      ▼
MCP Server
      │
      ▼
Tool
      │
      ▼
API externa
      │
      ▼
Dados
```

O servidor MCP funciona como uma camada de abstração.

Em vez de o agente precisar conhecer diretamente uma chamada como:

```text
SDK → banco → query → autenticação → resposta
```

ele recebe uma ferramenta semanticamente definida, por exemplo:

```text
contar_documentos
```

O servidor MCP fica responsável pela implementação técnica da operação.

---

# 6. Transporte local: STDIO

Nesta implementação, a comunicação entre **IBM Bob e servidor MCP ocorre localmente utilizando STDIO**.

O Bob inicia o servidor MCP como um processo local Node.js.

```text
IBM Bob
    │
    │ inicia processo
    ▼
node build/index.js
    │
    ▼
Servidor MCP
```

A comunicação ocorre pelos fluxos padrão do processo:

```text
Bob ───── STDIN ─────► MCP

Bob ◄──── STDOUT ───── MCP
```

As mensagens MCP são estruturadas utilizando **JSON-RPC**.

Portanto, não é necessário expor o servidor MCP local em uma porta pública para essa arquitetura.

---

# 7. Tunelamento e exposição de rede

É importante diferenciar **transporte MCP local** de **comunicação com serviços externos**.

Neste projeto:

```text
Bob
 │
 │ STDIO local
 ▼
MCP
 │
 │ HTTPS
 ▼
Appwrite Cloud
```

Não foi necessário criar um túnel público para permitir a comunicação entre Bob e MCP, pois ambos executam localmente e utilizam STDIO.

Ferramentas de tunelamento — como soluções que expõem temporariamente um serviço `localhost` através de uma URL pública — seriam necessárias em outro desenho arquitetural, por exemplo:

```text
Cliente remoto
      │
      │ HTTPS
      ▼
URL pública / túnel
      │
      ▼
localhost
      │
      ▼
Servidor MCP remoto/HTTP
```

Esse **não é o fluxo utilizado nesta implementação**.

A vantagem da solução local com STDIO é evitar a exposição desnecessária do servidor MCP à Internet.

---

# 8. Comunicação externa pela API

Embora Bob e MCP se comuniquem localmente, o servidor MCP precisa acessar o **Appwrite Cloud**.

Essa comunicação ocorre pela rede:

```text
Servidor MCP local
        │
        │ node-appwrite
        ▼
     HTTPS
        │
        ▼
Appwrite API
        │
        ▼
Appwrite Cloud
```

O código utiliza o SDK:

```text
node-appwrite
```

que encapsula as chamadas à API do Appwrite.

O cliente é inicializado conceitualmente da seguinte maneira:

```ts
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);
```

O tráfego entre a aplicação e o Appwrite Cloud ocorre sobre **HTTPS**, mantendo a comunicação de rede criptografada.

---

# 9. API Key, tokens e autenticação

Um aspecto importante da arquitetura é separar:

```text
identificação do projeto
```

de:

```text
credencial secreta
```

São utilizadas variáveis como:

```text
APPWRITE_ENDPOINT
APPWRITE_PROJECT_ID
APPWRITE_API_KEY
APPWRITE_DATABASE_ID
```

### Project ID

Identifica o projeto que será acessado.

### Database ID

Identifica a estrutura de dados utilizada.

### API Key

É uma **credencial secreta server-side** utilizada pelo SDK para autenticar a aplicação perante o Appwrite.

A API Key não deve ser:

```text
commitada no Git
publicada no GitHub
incluída no README
compartilhada em screenshots
hardcoded no código
```

### API Key não é simplesmente um token de usuário

Embora ambos sejam mecanismos relacionados à autenticação/autorização, eles possuem funções diferentes.

Neste projeto, a integração server-side utiliza **API Key**.

Tokens podem aparecer em outros fluxos de autenticação, particularmente autenticação temporária ou relacionada a usuários.

---

# 10. Princípio do menor privilégio

Uma credencial não deve possuir mais permissões do que aquelas necessárias para executar sua função.

Esse princípio é conhecido como:

```text
Principle of Least Privilege
```

Por exemplo, se uma versão pública do projeto precisa apenas consultar dados, uma configuração ideal deve privilegiar permissões de leitura.

Arquiteturalmente:

```text
Agente
   ↓
Tools permitidas
   ↓
API Key
   ↓
Scopes mínimos
   ↓
Dados autorizados
```

Isso reduz o impacto de uma eventual exposição de credenciais.

---

# 11. Engenharia de Dados

O MCP não deve ser confundido com um banco de dados.

Sua função é atuar como **camada de acesso e integração**.

A arquitetura de dados pode ser representada como:

```text
Fonte de dados
      ↓
Preparação
      ↓
Validação
      ↓
Estrutura persistida
      ↓
Appwrite
      ↓
Camada de acesso MCP
      ↓
Agente
```

Essa separação permite desacoplar:

```text
armazenamento
processamento
acesso
interface inteligente
```

---

# 12. Separação entre dados acadêmicos e demonstração

As bases utilizadas no trabalho acadêmico que motivou o projeto **não são disponibilizadas neste repositório**.

A publicação da arquitetura não exige a publicação do conjunto de dados original.

Para fins de demonstração e reprodutibilidade, o projeto poderá utilizar uma pequena **base sintética**, composta exclusivamente por registros artificiais.

Exemplo:

```csv
id,ano,sexo,faixa_etaria,categoria,desfecho
001,2022,F,30-39,A,1
002,2023,M,40-49,B,0
003,2024,F,20-29,A,0
004,2024,M,30-39,C,1
```

Esses registros:

```text
não representam pessoas reais;
não pertencem à base acadêmica;
não reproduzem registros individuais do estudo;
servem exclusivamente para demonstrar a arquitetura.
```

---

# 13. Arquitetura de dados da demonstração

A separação proposta é:

```text
                    PROJETO ACADÊMICO
                           │
                  ┌────────┴────────┐
                  │                 │
             bases reais       resultados
                  │                 │
                  └───────┬─────────┘
                          │
                     NÃO PUBLICADOS


                    PROJETO DIO
                         │
                         ▼
                  dados sintéticos
                         │
                         ▼
                  Appwrite Cloud
                         │
                         ▼
                    MCP Server
                         │
                         ▼
                     IBM Bob
```

Isso mantém separação entre:

**pesquisa científica**

e

**demonstração tecnológica**.

---

# 14. Ferramentas MCP

O servidor atualmente implementa seis ferramentas.

| Tool | Responsabilidade |
|---|---|
| `listar_colecoes` | Descobrir estruturas disponíveis |
| `consultar_documentos` | Executar consultas com filtros |
| `buscar_documento` | Recuperar um registro por ID |
| `contar_documentos` | Executar contagens |
| `criar_documento` | Inserir um registro |
| `atualizar_documento` | Atualizar um registro |

Cada ferramenta possui:

```text
nome
     +
descrição
     +
schema de entrada
     +
função de execução
```

Os schemas são validados com **Zod**.

Exemplo conceitual:

```text
Solicitação
     ↓
Schema Zod
     ↓
validação
     ↓
Tool MCP
     ↓
Appwrite SDK
```

Isso evita que parâmetros arbitrários sejam encaminhados diretamente ao serviço externo.

---

# 15. Fluxo completo de uma consulta

Uma solicitação pode percorrer o seguinte caminho:

```text
[1] Pessoa usuária
        │
        ▼
[2] IBM Bob
        │
        │ interpretação da intenção
        ▼
[3] seleção da Tool MCP
        │
        ▼
[4] chamada JSON-RPC / STDIO
        │
        ▼
[5] servidor Node.js local
        │
        ▼
[6] validação Zod
        │
        ▼
[7] implementação da Tool
        │
        ▼
[8] node-appwrite
        │
        ▼
[9] requisição HTTPS
        │
        ▼
[10] Appwrite API
        │
        ▼
[11] banco de dados
        │
        ▼
[12] resposta
        │
        ▼
[13] MCP
        │
        ▼
[14] IBM Bob
        │
        ▼
[15] Pessoa usuária
```

Essa sequência evidencia que o modelo de linguagem não acessa diretamente o banco.

---

# 16. Estrutura do projeto

```text
mcp-appwrite-sinan/
│
├── src/
│   └── index.ts
│
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

Uma versão demonstrativa também pode conter:

```text
data/
└── demo_sinan.csv
```

contendo exclusivamente dados sintéticos.

---

# 17. Instalação

Acesse a pasta:

```bash
cd mcp-appwrite-sinan
```

Instale as dependências:

```bash
npm install
```

Compile:

```bash
npm run build
```

Após o build:

```text
TypeScript
    ↓
compilação
    ↓
JavaScript
    ↓
build/index.js
```

O arquivo compilado é executado pelo Node.js quando o cliente MCP inicia o servidor.

---

# 18. Registro no IBM Bob

O Bob permite configurar servidores MCP locais.

Exemplo conceitual:

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

O parâmetro:

```text
command
```

define o executável.

Neste caso:

```text
node
```

O parâmetro:

```text
args
```

informa qual programa será executado.

E:

```text
env
```

fornece ao processo as variáveis necessárias à integração.

---

# 19. Gestão de segredos

O arquivo público não deve conter:

```text
APPWRITE_API_KEY=chave_real
```

Deve conter apenas:

```text
APPWRITE_API_KEY=SUA_API_KEY
```

Da mesma maneira, arquivos contendo segredos devem permanecer fora do versionamento.

Exemplo:

```text
.env
.env.local
credenciais.json
mcp.local.json
```

Esses arquivos podem ser adicionados ao:

```text
.gitignore
```

A separação é:

```text
GitHub
├── código                 ✓
├── documentação           ✓
├── configuração exemplo   ✓
├── dados sintéticos       ✓
│
├── API Key real           ✗
├── tokens                 ✗
├── .env real              ✗
└── dados acadêmicos       ✗
```

---

# 20. Git e GitHub

O código foi desenvolvido localmente e versionado utilizando Git.

Fluxo:

```text
arquivo local
     ↓
git add
     ↓
staging
     ↓
git commit
     ↓
repositório local
     ↓
git push
     ↓
GitHub
```

O GitHub representa a camada de:

- versionamento;
- rastreabilidade;
- documentação;
- compartilhamento;
- portfólio.

Ele não participa diretamente do caminho de execução:

```text
Bob → MCP → Appwrite
```

---

# 21. Reprodutibilidade

Para reproduzir a arquitetura não é necessário possuir acesso aos dados acadêmicos originais.

São necessários:

```text
Node.js
Git
cliente MCP compatível
projeto Appwrite
API Key própria
base sintética
código deste repositório
```

Cada pessoa pode criar seu próprio ambiente Appwrite e configurar:

```text
APPWRITE_ENDPOINT
APPWRITE_PROJECT_ID
APPWRITE_API_KEY
APPWRITE_DATABASE_ID
```

sem utilizar as credenciais da autora.

---

# 22. Exemplos de interação

Com uma base de demonstração configurada:

```text
Liste as coleções disponíveis.
```

```text
Quantos registros existem na coleção de demonstração?
```

```text
Mostre os primeiros 10 registros.
```

```text
Consulte um registro pelo identificador.
```

O agente seleciona a ferramenta adequada e o servidor executa a operação.

---

# 23. Observabilidade e tratamento de erros

As operações externas são executadas dentro de blocos de tratamento de exceções.

Conceitualmente:

```text
requisição
    ↓
try
    ↓
API
    ↓
resultado
```

ou:

```text
requisição
    ↓
erro
    ↓
catch
    ↓
resposta MCP
    ↓
isError
```

Isso evita que uma falha na API externa seja simplesmente propagada sem tratamento para o agente.

Também cria uma base para evoluções futuras de observabilidade, como:

```text
logs estruturados
latência das tools
quantidade de chamadas
taxa de erro
auditoria
tracing
```

---

# 24. Decisões arquiteturais

Algumas decisões foram importantes para o projeto.

### MCP local via STDIO

Evita expor desnecessariamente um servidor local à Internet.

### Appwrite como serviço externo

Separa persistência de dados da aplicação local.

### SDK server-side

Centraliza a comunicação com a API no servidor MCP.

### Variáveis de ambiente

Separam configuração e credenciais do código.

### Schemas com Zod

Validam a interface entre agente e ferramenta.

### Dados sintéticos

Permitem demonstrar a solução sem disponibilizar a base acadêmica.

### Git/GitHub

Permitem versionamento e documentação sem misturar código com segredos.

---

# 25. Segurança em camadas

A arquitetura adota uma abordagem de defesa em profundidade:

```text
Camada 1
Dados reais não publicados
        ↓
Camada 2
Dados sintéticos para demonstração
        ↓
Camada 3
Credenciais fora do Git
        ↓
Camada 4
Variáveis de ambiente
        ↓
Camada 5
API Key com scopes
        ↓
Camada 6
Validação Zod
        ↓
Camada 7
Tools MCP explicitamente definidas
        ↓
Camada 8
HTTPS para comunicação externa
```

O objetivo é reduzir a superfície de exposição tanto dos dados quanto das credenciais.

---

# 26. Tecnologias

| Tecnologia | Papel |
|---|---|
| IBM Bob | Agente de desenvolvimento e cliente MCP |
| MCP | Protocolo de integração agente–ferramentas |
| TypeScript | Implementação do servidor |
| Node.js | Runtime local |
| Zod | Validação dos schemas |
| `@modelcontextprotocol/server` | SDK MCP |
| `node-appwrite` | SDK de integração com Appwrite |
| Appwrite Cloud | Persistência e API |
| HTTPS/TLS | Proteção da comunicação externa |
| Git | Controle de versão |
| GitHub | Repositório e documentação |

---

# 27. O que aprendi

O principal aprendizado deste projeto foi compreender que construir uma aplicação com agentes de IA envolve muito mais do que enviar prompts a um modelo.

Existe uma arquitetura composta por responsabilidades diferentes:

```text
IA
↓
orquestração
↓
protocolo
↓
ferramentas
↓
API
↓
autenticação
↓
dados
↓
infraestrutura
```

O IBM Bob auxiliou no processo de desenvolvimento, enquanto o MCP forneceu uma interface padronizada entre o agente e as funcionalidades externas.

A implementação também permitiu compreender melhor conceitos de Engenharia de Software e Engenharia de Dados, como:

- separação de responsabilidades;
- desacoplamento;
- contratos de interface;
- schemas;
- APIs;
- autenticação;
- princípio do menor privilégio;
- gestão de segredos;
- persistência;
- integração local-cloud;
- tratamento de erros;
- versionamento;
- reprodutibilidade;
- segurança por camadas.

O resultado é uma arquitetura em que cada componente possui responsabilidade bem definida:

```text
IBM Bob
   │
   │ intenção e orquestração
   ▼
MCP
   │
   │ contrato de ferramentas
   ▼
Servidor Node.js
   │
   │ lógica de integração
   ▼
Appwrite SDK/API
   │
   │ comunicação autenticada
   ▼
Appwrite Cloud
   │
   │ persistência
   ▼
Dados
```

---

# 28. Limitações e evoluções futuras

Esta implementação possui caráter experimental e educacional.

Possíveis evoluções incluem:

- disponibilizar somente ferramentas de leitura na versão pública;
- aplicar scopes mínimos à API Key;
- criar testes automatizados para cada tool;
- adicionar logging estruturado;
- implementar métricas de observabilidade;
- adicionar tracing das chamadas;
- utilizar credenciais temporárias quando aplicável;
- implementar uma camada formal de autorização;
- containerizar o servidor com Docker;
- criar ambiente automatizado de testes;
- avaliar transporte MCP remoto via Streamable HTTP;
- implementar CI/CD;
- disponibilizar um dataset sintético maior para testes;
- criar testes de integração MCP → Appwrite.

---

# 29. Privacidade dos dados

Este repositório demonstra **arquitetura e código**, e não constitui publicação da base utilizada no trabalho acadêmico.

Não são disponibilizados:

- microdados originais;
- registros individuais da pesquisa;
- bases intermediárias do estudo;
- dados utilizados na modelagem acadêmica;
- credenciais;
- chaves de API;
- tokens;
- identificadores privados de infraestrutura.

Quando necessário para demonstração, são utilizados exclusivamente **dados sintéticos**.

---

# 30. Status

Projeto experimental desenvolvido para fins **educacionais e de portfólio**, como personalização do desafio da DIO.

**Arquitetura demonstrada:**

```text
IBM Bob
    │
    │ MCP / STDIO
    ▼
Servidor MCP local
    │
    │ Node.js + TypeScript
    ▼
node-appwrite
    │
    │ HTTPS / API Key
    ▼
Appwrite Cloud
    │
    ▼
Dados sintéticos de demonstração
```

**Versionamento:**

```text
Desenvolvimento local
        │
        │ Git
        ▼
      GitHub
```

A solução demonstra como agentes, protocolos, APIs, segurança e Engenharia de Dados podem ser combinados mantendo **separação entre aplicação, credenciais e dados**.## 16. Status do projeto

Projeto experimental desenvolvido para fins **educacionais e de portfólio**, como personalização de um desafio da DIO.

A base acadêmica e as credenciais utilizadas durante o desenvolvimento não fazem parte da publicação.

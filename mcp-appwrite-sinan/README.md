# mcp-appwrite-sinan

MCP Server que conecta o Bob ao banco de dados SINAN hospedado no Appwrite Cloud.

## Ferramentas disponíveis

| Ferramenta | O que faz |
|---|---|
| `listar_colecoes` | Lista todas as coleções do banco |
| `consultar_documentos` | Busca documentos com filtros campo=valor |
| `buscar_documento` | Retorna um documento pelo ID |
| `contar_documentos` | Conta registros (com ou sem filtros) |
| `criar_documento` | Insere um novo documento |
| `atualizar_documento` | Atualiza campos de um documento existente |

## Instalação e build

```bash
cd mcp-appwrite-sinan
npm install
npm run build
```

## Variáveis de ambiente necessárias

| Variável | Descrição |
|---|---|
| `APPWRITE_ENDPOINT` | URL do endpoint (ex: `https://cloud.appwrite.io/v1`) |
| `APPWRITE_PROJECT_ID` | ID do projeto no Appwrite |
| `APPWRITE_API_KEY` | API Key com permissão de leitura/escrita no banco |
| `APPWRITE_DATABASE_ID` | ID do banco de dados |

## Registro no Bob (mcp.json)

```json
{
  "mcpServers": {
    "appwrite-sinan": {
      "command": "node",
      "args": ["C:/Users/kymie/OneDrive/Desktop/projeto_TCC_Kymie_Saito/mcp-appwrite-sinan/build/index.js"],
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

## Exemplos de uso (perguntas para o Bob)

- *"Liste as coleções do banco SINAN"*
- *"Quantas notificações femininas existem em 2024?"*
- *"Mostre os primeiros 10 documentos da coleção notificacoes"*
- *"Busca o documento com ID xyz na coleção notificacoes"*

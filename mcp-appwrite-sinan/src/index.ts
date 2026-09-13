#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod/v4";
import { Client, Databases, Query, ID } from "node-appwrite";

// ─── Variáveis de ambiente obrigatórias ────────────────────────────────────
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
const APPWRITE_DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY || !APPWRITE_DATABASE_ID) {
  console.error(
    "ERRO: Variáveis de ambiente obrigatórias não definidas.\n" +
    "Defina: APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY, APPWRITE_DATABASE_ID"
  );
  process.exit(1);
}

// ─── Cliente Appwrite ───────────────────────────────────────────────────────
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const db = new Databases(client);
const DB_ID = APPWRITE_DATABASE_ID;

// ─── Servidor MCP ───────────────────────────────────────────────────────────
const server = new McpServer({
  name: "appwrite-sinan",
  version: "1.0.0",
});

// ────────────────────────────────────────────────────────────────────────────
// FERRAMENTA 1 — Listar coleções do banco
// ────────────────────────────────────────────────────────────────────────────
server.registerTool(
  "listar_colecoes",
  {
    description:
      "Lista todas as coleções disponíveis no banco de dados SINAN no Appwrite.",
    inputSchema: z.object({}),
  },
  async () => {
    try {
      const resp = await db.listCollections(DB_ID);
      const lista = resp.collections.map((c) => ({
        id: c.$id,
        nome: c.name,
        documentos: c.documentsCount ?? "N/A",
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(lista, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Erro ao listar coleções: ${String(err)}` }],
        isError: true,
      };
    }
  }
);

// ────────────────────────────────────────────────────────────────────────────
// FERRAMENTA 2 — Consultar documentos com filtros
// ────────────────────────────────────────────────────────────────────────────
server.registerTool(
  "consultar_documentos",
  {
    description:
      "Consulta documentos de uma coleção do SINAN com filtros opcionais. " +
      "Suporta filtro por campo igual a valor, limite de resultados e offset para paginação.",
    inputSchema: z.object({
      colecao_id: z
        .string()
        .describe("ID da coleção no Appwrite (ex: notificacoes_sinan)"),
      filtros: z
        .array(
          z.object({
            campo: z.string().describe("Nome do campo (ex: CS_SEXO, NU_ANO)"),
            valor: z.string().describe("Valor a filtrar (ex: F, 2024)"),
          })
        )
        .optional()
        .describe("Lista de filtros campo=valor (todos combinados com AND)"),
      limite: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(25)
        .describe("Quantidade máxima de documentos retornados (máx 100)"),
      offset: z
        .number()
        .int()
        .min(0)
        .default(0)
        .describe("Offset para paginação"),
    }),
  },
  async ({ colecao_id, filtros, limite, offset }) => {
    try {
      const queries: string[] = [
        Query.limit(limite),
        Query.offset(offset),
      ];

      if (filtros && filtros.length > 0) {
        for (const f of filtros) {
          queries.push(Query.equal(f.campo, f.valor));
        }
      }

      const resp = await db.listDocuments(DB_ID, colecao_id, queries);

      return {
        content: [
          {
            type: "text",
            text:
              `Total encontrado: ${resp.total}\n` +
              `Exibindo: ${resp.documents.length} documentos\n\n` +
              JSON.stringify(resp.documents, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Erro na consulta: ${String(err)}` }],
        isError: true,
      };
    }
  }
);

// ────────────────────────────────────────────────────────────────────────────
// FERRAMENTA 3 — Buscar um documento pelo ID
// ────────────────────────────────────────────────────────────────────────────
server.registerTool(
  "buscar_documento",
  {
    description: "Retorna um documento específico pelo seu ID único.",
    inputSchema: z.object({
      colecao_id: z.string().describe("ID da coleção"),
      documento_id: z.string().describe("ID do documento"),
    }),
  },
  async ({ colecao_id, documento_id }) => {
    try {
      const doc = await db.getDocument(DB_ID, colecao_id, documento_id);
      return {
        content: [{ type: "text", text: JSON.stringify(doc, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Documento não encontrado: ${String(err)}` }],
        isError: true,
      };
    }
  }
);

// ────────────────────────────────────────────────────────────────────────────
// FERRAMENTA 4 — Contar documentos com filtro
// ────────────────────────────────────────────────────────────────────────────
server.registerTool(
  "contar_documentos",
  {
    description:
      "Conta quantos documentos existem em uma coleção, opcionalmente com filtros. " +
      "Útil para análises epidemiológicas rápidas (ex: quantas notificações femininas em 2024).",
    inputSchema: z.object({
      colecao_id: z.string().describe("ID da coleção"),
      filtros: z
        .array(
          z.object({
            campo: z.string(),
            valor: z.string(),
          })
        )
        .optional()
        .describe("Filtros campo=valor opcionais"),
    }),
  },
  async ({ colecao_id, filtros }) => {
    try {
      const queries: string[] = [Query.limit(1)];

      if (filtros && filtros.length > 0) {
        for (const f of filtros) {
          queries.push(Query.equal(f.campo, f.valor));
        }
      }

      const resp = await db.listDocuments(DB_ID, colecao_id, queries);

      return {
        content: [
          {
            type: "text",
            text: `Total de documentos${filtros?.length ? " com os filtros aplicados" : ""}: ${resp.total}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Erro ao contar: ${String(err)}` }],
        isError: true,
      };
    }
  }
);

// ────────────────────────────────────────────────────────────────────────────
// FERRAMENTA 5 — Criar/inserir um documento
// ────────────────────────────────────────────────────────────────────────────
server.registerTool(
  "criar_documento",
  {
    description:
      "Insere um novo documento em uma coleção do SINAN. " +
      "Os dados devem ser passados como objeto JSON com os campos da coleção.",
    inputSchema: z.object({
      colecao_id: z.string().describe("ID da coleção"),
      dados: z
        .record(z.string(), z.unknown())
        .describe("Objeto JSON com os campos e valores do documento"),
      documento_id: z
        .string()
        .optional()
        .describe("ID personalizado (opcional — se omitido, o Appwrite gera automaticamente)"),
    }),
  },
  async ({ colecao_id, dados, documento_id }) => {
    try {
      const doc = await db.createDocument(
        DB_ID,
        colecao_id,
        documento_id ?? ID.unique(),
        dados
      );
      return {
        content: [
          {
            type: "text",
            text: `Documento criado com sucesso.\nID: ${doc.$id}\n\n${JSON.stringify(doc, null, 2)}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Erro ao criar documento: ${String(err)}` }],
        isError: true,
      };
    }
  }
);

// ────────────────────────────────────────────────────────────────────────────
// FERRAMENTA 6 — Atualizar um documento existente
// ────────────────────────────────────────────────────────────────────────────
server.registerTool(
  "atualizar_documento",
  {
    description: "Atualiza campos de um documento existente. Apenas os campos passados serão alterados.",
    inputSchema: z.object({
      colecao_id: z.string().describe("ID da coleção"),
      documento_id: z.string().describe("ID do documento a atualizar"),
      dados: z
        .record(z.string(), z.unknown())
        .describe("Campos e novos valores a atualizar"),
    }),
  },
  async ({ colecao_id, documento_id, dados }) => {
    try {
      const doc = await db.updateDocument(DB_ID, colecao_id, documento_id, dados);
      return {
        content: [
          {
            type: "text",
            text: `Documento atualizado.\nID: ${doc.$id}\n\n${JSON.stringify(doc, null, 2)}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Erro ao atualizar: ${String(err)}` }],
        isError: true,
      };
    }
  }
);

// ────────────────────────────────────────────────────────────────────────────
// Inicialização
// ────────────────────────────────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[appwrite-sinan] MCP server iniciado e aguardando conexões.");
}

main().catch((err) => {
  console.error("[appwrite-sinan] Erro fatal:", err);
  process.exit(1);
});

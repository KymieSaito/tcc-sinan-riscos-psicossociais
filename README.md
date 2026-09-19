# TCC — Riscos Psicossociais e Saúde Mental Relacionada ao Trabalho

Projeto desenvolvido no contexto do TCC do MBA em **Data Science & Analytics**, integrando duas fontes complementares de informação sobre saúde mental relacionada ao trabalho:

1. narrativas digitais públicas recuperadas do YouTube;
2. registros de transtornos mentais relacionados ao trabalho do Sistema de Informação de Agravos de Notificação (SINAN).

A integração é realizada em nível analítico e interpretativo. Não existe vinculação individual entre usuários do YouTube e registros do SINAN.

## Objetivo

Analisar riscos psicossociais e saúde mental relacionada ao trabalho por meio da integração analítica entre narrativas digitais e registros epidemiológicos, utilizando técnicas de Processamento de Linguagem Natural (PLN), aprendizado de máquina e modelagem estatística.

No componente epidemiológico, investiga-se, entre os casos notificados no SINAN com evolução classificável, quais características estão associadas à ocorrência de incapacidade ou óbito relacionado ao trabalho e em que medida modelos de classificação conseguem discriminar esses desfechos em períodos posteriores.

## Estrutura analítica

O estudo foi organizado em dois pipelines independentes e posteriormente integrados na interpretação dos resultados.

### 1. Narrativas digitais — YouTube

O pipeline de Social Media contempla:

- definição de consultas temáticas relacionadas à NR-1, saúde mental e riscos psicossociais;
- recuperação de vídeos pela YouTube Data API v3;
- coleta de comentários principais e respostas;
- consolidação e deduplicação dos registros;
- preparação e controle de elegibilidade textual;
- triagem lexical e análise de similaridade semântica;
- classificação de relevância temática;
- auditoria humana de uma amostra de 200 narrativas;
- reconstrução do corpus com prioridade para os rótulos humanos;
- análise de sentimento;
- geração de indicadores agregados.

A estratégia de recuperação, os parâmetros utilizados e as decisões necessárias para a reprodução desse pipeline são documentados na pasta `youtube/`.

### 2. Registros epidemiológicos — SINAN

O pipeline epidemiológico contempla:

- auditoria estrutural e limpeza da base;
- análise de dados ausentes;
- tratamento e padronização dos diagnósticos CID-10;
- definição da coorte de transtornos mentais F00–F99;
- análise epidemiológica e temporal;
- construção do desfecho binário;
- seleção e preparação das variáveis;
- Regressão Logística;
- Random Forest;
- XGBoost;
- LightGBM;
- validação temporal;
- comparação por ROC-AUC e PR-AUC;
- análise do limiar de classificação;
- avaliação em períodos posteriores;
- análise inferencial por Regressão Logística multivariável.

### Definição do desfecho no SINAN

**Sem incapacidade/óbito**
- Cura
- Cura não confirmada

**Com incapacidade/óbito**
- Incapacidade temporária
- Incapacidade permanente parcial
- Incapacidade permanente total
- Óbito por doença relacionada ao trabalho

Essa definição representa a evolução registrada no sistema de vigilância e não corresponde a uma classificação de gravidade clínica.

## Integração das fontes

Os pipelines do YouTube e do SINAN são executados independentemente.

As narrativas digitais são utilizadas para investigar manifestações espontâneas relacionadas à saúde mental, às condições de trabalho e aos riscos psicossociais. O SINAN é utilizado para caracterizar os transtornos mentais relacionados ao trabalho que alcançaram o sistema formal de vigilância e investigar seus desfechos.

Não são realizadas vinculações individuais entre as fontes nem inferências de que uma narrativa digital corresponda posteriormente a uma notificação no SINAN.

## Validação temporal

A modelagem do SINAN considera explicitamente a dimensão temporal dos dados, utilizando períodos anteriores para desenvolvimento e períodos posteriores para avaliação.

Os anos sem observações disponíveis na base não são interpretados como ocorrência igual a zero.

## Reprodutibilidade

As principais dependências do projeto estão disponíveis em:

```bash
requirements.txt

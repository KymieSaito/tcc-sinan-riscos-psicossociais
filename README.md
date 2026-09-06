# TCC — Transtornos Mentais Relacionados ao Trabalho no SINAN

Projeto desenvolvido no contexto do TCC em **Data Science & Analytics**, com foco na análise de transtornos mentais relacionados ao trabalho registrados no Sistema de Informação de Agravos de Notificação (SINAN).

## Objetivo

Investigar, entre os registros de transtornos mentais relacionados ao trabalho com evolução classificável, quais características estão associadas à ocorrência de desfecho desfavorável, em comparação com evolução favorável.

### Definição do desfecho

**Favorável**
- Cura
- Cura não confirmada

**Desfavorável**
- Incapacidade temporária
- Incapacidade permanente parcial
- Incapacidade permanente total
- Óbito por doença relacionada ao trabalho

## Etapas da análise

O notebook contempla:

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
- comparação de desempenho por ROC-AUC e PR-AUC;
- análise de sensibilidade ao limiar de classificação;
- avaliação temporal em períodos posteriores;
- preparação da análise inferencial;
- estimação de associações ajustadas por Regressão Logística.

## Validação temporal

A estratégia analítica considera explicitamente a dimensão temporal dos dados.

Os anos sem observações disponíveis na base não são interpretados como ocorrência igual a zero.

## Reprodutibilidade

As principais dependências do projeto estão disponíveis em:

```bash
requirements.txt
```

Para instalar as dependências:

```bash
pip install -r requirements.txt
```

## Dados

Os microdados utilizados na análise **não são armazenados neste repositório**.

Arquivos de dados brutos, ambientes virtuais, credenciais e outros arquivos locais são excluídos do versionamento por meio do `.gitignore`.

O repositório é destinado ao armazenamento do código, documentação e resultados analíticos necessários ao acompanhamento e à reprodutibilidade do trabalho.

## Estrutura do repositório

- `notebook_sinan_nr1_limpo_variaveis_0926.ipynb` — notebook principal da análise;
- `requirements.txt` — dependências do ambiente Python;
- `.gitignore` — arquivos excluídos do controle de versão;
- arquivos `.csv` — resultados tabulares produzidos durante as auditorias;
- arquivos `.png` — figuras e resultados gráficos produzidos durante a análise.

## Status

Projeto em desenvolvimento.

## Autoria

**Kymie Karina Silva Saito**
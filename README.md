## Riscos Psicossociais e Saúde Mental do Trabalhador no Contexto da NR-1

### Integração entre Narrativas Digitais, Dados do SINAN e Aprendizado de Máquina

---

**Trabalho de Conclusão de Curso — MBA em Data Science & Analytics**  
**Universidade de São Paulo — USP**  
**Escola Superior de Agricultura “Luiz de Queiroz” — ESALQ**  
**PECEGE — Programa de Educação Continuada em Economia e Gestão**

**Autora:** Kymie Karina Silva Saito  
**Orientadora:** Profa. Gabrielle  
**Área:** Data Science & Analytics  
**Ano:** 2026  

---
**Palavras-chave:** saúde mental ocupacional · riscos psicossociais · NR-1 · SINAN · 
Social Listening · Processamento de Linguagem Natural · Machine Learning · 
Regressão Logística
# Riscos Psicossociais e Saúde Mental do Trabalhador no Contexto da NR-1

### Integração entre Narrativas Digitais, Dados do SINAN e Aprendizado de Máquina

---

**Trabalho de Conclusão de Curso — MBA em Data Science & Analytics**  
**Universidade de São Paulo — USP**  
**Escola Superior de Agricultura “Luiz de Queiroz” — ESALQ**  
**PECEGE — Programa de Educação Continuada em Economia e Gestão**

**Autora:** Kymie Karina Silva Saito  
**Orientadora:** Profa. Gabrielle  
**Área:** Data Science & Analytics  
**Ano:** 2026  

---

> **Repositório computacional do Trabalho de Conclusão de Curso**
>
> Este repositório reúne a documentação metodológica, os códigos e os resultados
> computacionais desenvolvidos para investigar riscos psicossociais e saúde mental
> relacionada ao trabalho a partir de duas perspectivas complementares:
> **narrativas digitais públicas** e **registros do Sistema de Informação de Agravos
> de Notificação (SINAN)**.
>
> O estudo combina **Processamento de Linguagem Natural (PLN)**, representações
> semânticas, validação humana, análise de sentimento, aprendizado de máquina,
> validação temporal e modelagem estatística inferencial.

**Palavras-chave:** saúde mental ocupacional · riscos psicossociais · NR-1 · SINAN ·
Social Listening · Processamento de Linguagem Natural · Machine Learning ·
Regressão Logística

---

### Visão geral do projeto

`Social Listening` · `NLP` · `Embeddings` · `Human-in-the-loop` ·
`Transformers` · `SINAN` · `Logistic Regression` · `Random Forest` ·
`XGBoost` · `LightGBM` · `Temporal Validation` · `Statistical Inference`

---

## Do relato espontâneo à vigilância epidemiológica


> **Repositório computacional do Trabalho de Conclusão de Curso**
>
> Este repositório reúne a documentação metodológica, os códigos e os resultados
> computacionais desenvolvidos para investigar riscos psicossociais e saúde mental
> relacionada ao trabalho a partir de duas perspectivas complementares:
> **narrativas digitais públicas** e **registros do Sistema de Informação de Agravos
> de Notificação (SINAN)**.
>
> O estudo combina **Processamento de Linguagem Natural (PLN)**, representações
> semânticas, validação humana, análise de sentimento, aprendizado de máquina,
> validação temporal e modelagem estatística inferencial.

---



## Do relato espontâneo à vigilância epidemiológica

O trabalho não constitui apenas uma fonte de renda. Ele participa da construção de identidade,
pertencimento, relações sociais, propósito e organização da vida cotidiana. Em condições
adequadas, pode exercer papel protetivo para a saúde mental; em condições desfavoráveis,
determinadas características da organização e das relações de trabalho podem constituir
fontes relevantes de risco psicossocial.

A literatura científica sustenta essa relação. Harvey et al. (2017), em uma meta-revisão
sistemática sobre fatores ocupacionais e problemas comuns de saúde mental, identificaram três
grandes dimensões pelas quais características do trabalho podem contribuir para o
desenvolvimento de depressão e ansiedade: desequilíbrios no desenho do trabalho, incerteza
ocupacional e ausência de valor e respeito no ambiente laboral.

Entre os fatores com evidências prospectivas destacaram-se altas demandas, baixo controle
sobre o trabalho, desequilíbrio entre esforço e recompensa, baixa justiça relacional e
procedimental, estresse relacionado ao papel desempenhado, bullying e baixo suporte social.

A Organização Mundial da Saúde (OMS) estima que depressão e ansiedade sejam responsáveis
pela perda de aproximadamente 12 bilhões de dias de trabalho por ano no mundo, com impacto
econômico próximo de US$ 1 trilhão anual em perda de produtividade.

No Brasil, essa discussão adquiriu relevância regulatória adicional com a inclusão expressa
dos fatores de riscos psicossociais relacionados ao trabalho no Gerenciamento de Riscos
Ocupacionais (GRO) da Norma Regulamentadora nº 1 (NR-1).

Essas evidências conduzem a uma questão central para este projeto de Ciência de Dados:

> **Onde esse fenômeno pode ser observado nos dados?**

Uma possibilidade são os sistemas formais de vigilância. O Sistema de Informação de Agravos
de Notificação (SINAN) permite observar transtornos mentais relacionados ao trabalho que
alcançaram os serviços e o sistema de vigilância em saúde.

Mas essa é apenas uma perspectiva.

Experiências de pressão, sobrecarga, assédio, medo, conflitos, ausência de reconhecimento e
sofrimento relacionado ao trabalho também podem ser expressas espontaneamente fora dos
sistemas institucionais.

Parte dessas manifestações ocorre em ambientes digitais.

Este projeto parte justamente da diferença entre **o que é narrado** e **o que é formalmente
registrado**.

---

# Arquitetura analítica do estudo

O estudo foi organizado em dois pipelines computacionalmente independentes.

```mermaid
flowchart TD
    A["Saúde mental relacionada ao trabalho"]

    A --> B["Narrativas digitais — YouTube"]
    A --> C["Vigilância epidemiológica — SINAN"]

    B --> B1["YouTube Data API v3"]
    B1 --> B2["Vídeos"]
    B2 --> B3["Comentários e respostas"]
    B3 --> B4["Pré-processamento textual"]
    B4 --> B5["Representação semântica"]
    B5 --> B6["Relevância temática"]
    B6 --> B7["Auditoria humana"]
    B7 --> B8["Corpus relevante"]
    B8 --> B9["Análise de sentimento"]

    C --> C1["Auditoria e limpeza"]
    C1 --> C2["Coorte F00–F99"]
    C2 --> C3["Caracterização epidemiológica"]
    C3 --> C4["Construção do desfecho"]
    C4 --> C5["LR / RF / XGBoost / LightGBM"]
    C5 --> C6["Validação temporal"]
    C6 --> C7["Avaliação de limiar"]
    C7 --> C8["Regressão inferencial"]

    B9 --> D["Integração analítica e interpretativa"]
    C8 --> D

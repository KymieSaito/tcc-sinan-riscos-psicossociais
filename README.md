# TCC — Riscos Psicossociais e Saúde Mental Relacionada ao Trabalho

## Do relato espontâneo à vigilância epidemiológica

O trabalho ocupa uma posição ambivalente na saúde mental. Em condições adequadas, pode
oferecer renda, identidade, propósito, relações sociais e estabilidade. Em condições
desfavoráveis, entretanto, aspectos relacionados à organização e às relações de trabalho
podem constituir importantes fatores de risco psicossocial.

A literatura científica mostra que esse fenômeno não se restringe à percepção individual.
A meta-revisão de Harvey et al. (2017) identificou três grandes dimensões pelas quais o
trabalho pode contribuir para problemas comuns de saúde mental: desequilíbrios no desenho
do trabalho, incerteza ocupacional e ausência de valor e respeito no ambiente laboral.
Entre os fatores com evidências prospectivas destacaram-se altas demandas, baixo controle,
desequilíbrio entre esforço e recompensa, injustiça organizacional, estresse relacionado
ao papel desempenhado, bullying e baixo suporte social.

Uma revisão sistemática posterior reforçou parte dessas evidências ao identificar associações
entre transtornos relacionados ao estresse e exposições psicossociais como altas demandas,
desequilíbrio esforço–recompensa, baixa justiça organizacional, baixo apoio social e elevadas
demandas emocionais.

A dimensão do problema também aparece em escala global. A Organização Mundial da Saúde
(OMS) estima que depressão e ansiedade sejam responsáveis pela perda de aproximadamente
12 bilhões de dias de trabalho por ano, com impacto econômico de cerca de US$ 1 trilhão
anuais em perda de produtividade. A OMS reconhece ainda que ambientes de trabalho
desfavoráveis — incluindo cargas excessivas, baixo controle, insegurança, discriminação,
violência, assédio e outras características da organização do trabalho — podem representar
riscos à saúde mental.

Essas evidências suscitam, entretanto, uma questão importante para a análise de dados:

**Onde esse fenômeno pode ser observado?**

Uma possibilidade são os sistemas formais de vigilância em saúde. No Brasil, o Sistema de
Informação de Agravos de Notificação (SINAN) registra casos de transtornos mentais
relacionados ao trabalho que alcançam os serviços e o sistema de vigilância.

Essa fonte, porém, representa apenas uma dimensão do fenômeno.

Experiências de pressão, sobrecarga, assédio, esgotamento, conflitos e sofrimento relacionado
ao trabalho também podem ser narradas espontaneamente fora dos sistemas institucionais.
Plataformas digitais constituem um desses espaços de manifestação.
## Da pergunta científica ao código

A implementação computacional foi construída a partir da mesma lógica que orienta o desenho
do estudo. Em vez de reunir as duas fontes em uma única base, foram desenvolvidos dois
pipelines independentes — um para as narrativas digitais e outro para os registros do SINAN —
preservando as características e limitações próprias de cada fonte.

### Pipeline 1 — Narrativas digitais e Processamento de Linguagem Natural

A primeira etapa buscou transformar manifestações textuais não estruturadas em um corpus
passível de análise.

A recuperação dos dados foi realizada por meio da YouTube Data API v3. A estratégia de busca
foi organizada em cinco eixos temáticos e 23 consultas relacionadas à NR-1, saúde mental no
trabalho, riscos psicossociais, cultura e gestão organizacional e transformações contemporâneas
do trabalho.

Em termos computacionais, o pipeline seguiu a lógica:

`consultas → vídeos → comentários/respostas → processamento textual → relevância → auditoria humana → sentimento`

Os vídeos recuperados em diferentes consultas foram consolidados pelo identificador
`video_id`, evitando que o mesmo vídeo fosse contabilizado repetidamente. Comentários e
respostas foram posteriormente associados aos respectivos vídeos, e cada narrativa recebeu
um identificador único (`registro_id`), permitindo acompanhar o mesmo registro ao longo das
diferentes etapas de processamento.

A seleção temática não foi baseada apenas na presença de palavras-chave. Inicialmente,
foram construídos indicadores textuais relacionados ao domínio do estudo. Em seguida, foram
utilizadas representações semânticas para avaliar a proximidade entre as narrativas e o tema
investigado. Essa estratégia permitiu considerar relações de significado que não dependiam
exclusivamente da ocorrência literal de termos específicos.

A relevância temática constituiu uma etapa particularmente importante do pipeline. Um
comentário publicado em um vídeo sobre saúde mental ou NR-1 não é necessariamente uma
narrativa sobre riscos psicossociais ou saúde mental relacionada ao trabalho. Mensagens de
elogio ao vídeo, manifestações genéricas ou comentários sem conteúdo substantivo sobre o
objeto de estudo poderiam permanecer no corpus caso apenas o contexto do vídeo fosse
considerado.

Por esse motivo, foi realizada auditoria humana de 200 narrativas. Destas, 123 foram
consideradas tematicamente relevantes e 77 não relevantes. A auditoria revelou registros que
haviam sido descartados ou mantidos inadequadamente durante etapas anteriores e motivou a
reconstrução da seleção a partir de uma base anterior ao filtro final. Nos registros auditados,
a decisão humana recebeu prioridade sobre a classificação automática.

Esse processo resultou, para o recorte de 2026, em **1.031 narrativas tematicamente relevantes,
provenientes de 196 vídeos**.

Após a definição do corpus relevante, realizou-se a análise de sentimento com o modelo
multilíngue `lxyuan/distilbert-base-multilingual-cased-sentiments-student`, baseado em
Transformer. O modelo estimou, para cada narrativa, probabilidades associadas às classes
positiva, neutra e negativa, além da classe de maior probabilidade.

O processamento foi realizado em lotes de 32 registros, com truncamento em 512 tokens e uso
de GPU quando disponível. O modelo pré-treinado foi empregado para inferência; não foi
realizado fine-tuning sobre o corpus deste estudo.

A análise de sentimento foi restrita às narrativas consideradas tematicamente relevantes.
Assim, uma mensagem linguisticamente positiva, mas constituída apenas por elogio ao vídeo,
por exemplo, não foi utilizada para caracterizar o sentimento relacionado ao objeto do estudo.

No corpus final de 2026, 974 das 1.031 narrativas possuíam classificação de sentimento
disponível. As 57 restantes permaneceram nas demais análises do corpus, mas não foram
incluídas no denominador da distribuição de sentimento.

Essa distinção é importante: o código não transforma comentários do YouTube em diagnósticos
ou estimativas epidemiológicas. O pipeline identifica e organiza narrativas públicas que
apresentam conteúdo relacionado ao domínio investigado.

### Pipeline 2 — SINAN, aprendizado de máquina e análise inferencial

Enquanto o primeiro pipeline parte de texto não estruturado, o segundo parte de registros
estruturados de vigilância epidemiológica.

A base original do SINAN foi inicialmente submetida a auditoria estrutural, identificação de
duplicidades, avaliação de dados ausentes, padronização de variáveis e tratamento dos códigos
da Classificação Internacional de Doenças (CID-10).

Após a limpeza, definiu-se a coorte epidemiológica formada pelos registros de transtornos
mentais e comportamentais pertencentes ao capítulo F00–F99. Essa etapa resultou em
**18.292 registros**, utilizados para a caracterização epidemiológica e temporal.

A modelagem respondeu a uma pergunta mais específica. Entre os registros cuja evolução
permitia classificação, construiu-se um desfecho binário distinguindo:

- **sem incapacidade/óbito:** cura ou cura não confirmada;
- **com incapacidade/óbito:** incapacidade temporária, incapacidade permanente parcial,
  incapacidade permanente total ou óbito por doença relacionada ao trabalho.

A base utilizada nessa etapa compreendeu **13.598 registros**, dos quais 11.027 apresentaram
o desfecho de incapacidade/óbito e 2.571 o desfecho sem incapacidade/óbito.

Foram utilizadas 12 variáveis preditoras disponíveis na base, contemplando idade e
características sociodemográficas, ocupacionais e clínicas. Variáveis cuja utilização pudesse
introduzir informação posterior ao desfecho foram evitadas na modelagem principal.

Quatro algoritmos supervisionados foram comparados:

`Regressão Logística → Random Forest → XGBoost → LightGBM`

A comparação não foi baseada apenas em uma divisão aleatória entre treino e teste. Como os
registros possuem dimensão temporal, adotou-se validação temporal com janelas expansivas.
Modelos treinados em anos anteriores foram avaliados em anos posteriores, procurando
reproduzir uma situação mais próxima daquela em que um modelo desenvolvido com informações
já disponíveis é aplicado a dados futuros.

O desenvolvimento utilizou registros de 2014 a 2023, respeitando a ausência de observações
disponíveis para 2020 e 2021. Foram construídas previsões fora da amostra temporal
(out-of-fold) para 2017, 2018, 2019, 2022 e 2023. Posteriormente, 2024 foi utilizado como
período de avaliação temporal e 2025 como avaliação complementar.

O desempenho dos algoritmos foi comparado principalmente por ROC-AUC e PR-AUC, além de
sensibilidade, especificidade, precisão, F1, acurácia e acurácia balanceada. A comparação
temporal indicou desempenho próximo entre Regressão Logística e XGBoost, sem evidência
suficiente para afirmar superioridade da Regressão Logística sobre o XGBoost nas diferenças
pareadas de ROC-AUC e PR-AUC.

A Regressão Logística foi mantida como modelo principal por combinar desempenho temporal,
estabilidade e interpretabilidade, característica especialmente relevante para a etapa
seguinte do estudo.

### Da predição para a associação

Predizer um desfecho e investigar quais características permanecem associadas a ele são
perguntas diferentes.

Por isso, o pipeline não terminou na comparação dos algoritmos de aprendizado de máquina.

Foi estimado adicionalmente um modelo de regressão logística multivariável com erros-padrão
robustos, destinado à análise inferencial das associações ajustadas. Os resultados foram
expressos por odds ratios (OR), intervalos de confiança de 95% e valores de p.

A relação da idade com o desfecho também foi investigada sob diferentes formas funcionais,
incluindo especificações linear, quadrática e por splines naturais. A especificação quadrática
foi mantida no modelo final considerando ajuste e parcimônia.

Essa etapa não foi utilizada para estabelecer causalidade. As estimativas representam
associações condicionais entre características registradas no SINAN e o desfecho estudado,
considerando as demais variáveis incluídas no modelo.

### Onde os códigos se encontram

Os dois pipelines permanecem computacionalmente independentes:

```text
Narrativas digitais
        │
        ├── recuperação
        ├── processamento textual
        ├── relevância semântica
        ├── auditoria humana
        └── sentimento
                 │
                 ▼
          interpretação
            integrada
                 ▲
                 │
SINAN
        │
        ├── limpeza e auditoria
        ├── coorte F00–F99
        ├── análise epidemiológica
        ├── aprendizado de máquina
        ├── validação temporal
        └── análise inferencial

Este projeto parte justamente dessa diferença entre **o que é narrado** e **o que é
formalmente registrado**.

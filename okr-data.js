// DADOS INICIAIS DOS OKRs (transcritos das planilhas de cada ciclo)
// Formato de cada KR:
// [código, descrição, valor base, valor alvo, valor atual, progresso, falta, status, observação, data (opcional)]
// Quando a data do KR não é informada, usa a data padrão da seção (campo "d").

const C = "Concluído";
const A = "Atrás";
const V = "Vencido";
const N = "Não iniciado";
const P = "No prazo";

// Quadro estratégico anual (repete nos dois primeiros ciclos com status diferentes)
const OBJ_RESULTADO = "Promover a prosperidade financeira, impulsionar o desenvolvimento dos membros e crescer sustentavelmente.";
const OBJ_GENTE = "Promover a melhor vivência dentro da Dinâmica, tanto no âmbito profissional, como no pessoal e lideranças protagonistas e inspiradora.";
const OBJ_IMPACTO = "Desenvolver soluções de grande impacto para o mercado e para a sociedade.";
const OBJ_INOVACAO = "Se tornar uma empresa referência em inovação, tanto no Movimento, quanto no mercado.";

const OBJ_JF_TATICO = "Manter a saúde financeira da Dinâmica, a partir de um controle financeiro assertivo e transparente e com isso promovendo o conhecimento prático e experiência empreendedora entre membros.";
const OBJ_JF_OPERACIONAL = "Estabelecer metas mensuráveis para a redução de custos operacionais e maior rigor na tomada de decisão, com foco na eficiência.";

const OBJ_DHO_1 = "PROPORCIONAR UMA BOA VIVÊNCIA EMPRESARIAL PARA TODOS OS MEMBROS FAZENDO COM QUE ELES SE SINTAM SATISFEITOS, ENGAJADOS E PERTENCENTES A EJ";
const OBJ_DHO_2 = "MANTER A DIRETORIA INOVADORA E SEMPRE EM MELHORIA CONTÍNUA";
const OBJ_DHO_3 = "POSSIBILITAR O DESENVOLVIMENTO E ENGAJAMENTO DE TODOS OS MEBROS DA EJ";
const OBJ_DHO_4 = "SER UM TIME UNIDO E ARRASADHOR, QUE JUNTAS FORTALECEM O PODER DE DHO ✨💋";

const OBJ_MKT_ATRACAO = "O: Obter sucesso na atração, aumentando a visibilidade e o reconhecimento da marca";
const OBJ_MKT_INBOUND = "O: Obter sucesso na prospecção passiva, gerando a maior receita advinda do Inbound Marketing na Dinâmica";

const OBJ_NEG_TATICO = "O: Ser o maior time de vendas e referência entre as EJs do Paraná e com isso deixar um legado para as próximas gerações";
const OBJ_NEG_OPERACIONAL = "O: Chegar aonde nenhuma diretoria de Negócios chegou através da constância";

const OBJ_PROJ_INOVACAO = "Ampliar a relevância do pilar de Melhoria Continua através do aumento dos estímulos de inovação, de forma satisfatória e aplicável.";
const OBJ_PROJ_REINCIDENCIA = "Contribuir para o faturamento geral da Dinâmica, identificando oportunidades, desenvolvendo soluções personalizadas e negociando projetos de reincidência.";

const OBJ_REP_EVOA = "Expandir o alcance da empresa e tornar a representatividade uma fonte importante de oportunidades";
const OBJ_REP_CD = "Consolidar o evento como uma parte significativa da empresa, sendo uma fonte de lucro e visibilidade.";

const OBJ_PRES_TATICO = "Fortalecer a imagem da Dinâmica no MEJ e no meio acadêmico, gerando visibilidade e oportunidades que tragam benefícios diretos à DEJ.";
const OBJ_PRES_OPERACIONAL = "Apoiar e assegurar o funcionamento eficiente das diretorias, promovendo a integração e o alcance dos objetivos globais da empresa.";

const OKR_SEED = [
  // ============================================================
  // 1º CICLO
  // ============================================================
  {
    id: "c1",
    label: "1º Ciclo",
    period: "Jan – Abr/2026",
    boards: [
      {
        t: "OKR Estratégico DEJ", c: "ANUAL", i: "01/01/2026", f: "31/12/2026",
        s: [
          { h: "RESULTADO", o: OBJ_RESULTADO, d: "31/10/2026", k: [
            ["KR 1.1", "Participação de 50% do faturamento advindo da Diretoria Comercial", "", "50,0%", "", "0,00%", "50,0%", A],
            ["KR 1.2", "Participação de 25% do faturamento advindo da Diretoria de Projetos", "", "25,0%", "", "0,00%", "25,0%", A],
            ["KR 1.3", "Participação de 25% do faturamento advindo de Representatividade", "", "25,0%", "", "0,00%", "25,0%", A]
          ]},
          { h: "GENTE", o: OBJ_GENTE, d: "31/10/2026", k: [
            ["KR 1.1", "Atingir E-NPS >= 8,5", "", "8,5", "", "0,00%", "8,5", A],
            ["KR 1.2", "Fazer 100% dos PDI's do ciclo", "", "100%", "", "0,00%", "100%", A],
            ["KR 1.3", "Nível de satisfação dos membros com capacitações, eventos internos >= 87%", "", "8,7", "", "0,00%", "8,7", A],
            ["KR 1.4", "Atingir retenção >= 30%", "", "30%", "", "0,00%", "30%", A],
            ["KR 1.5", "Clima organizacional referente a pertencimento e segurança dos membros da EJ >= 80%", "", "80%", "", "0,00%", "80%", A]
          ]},
          { h: "IMPACTO", o: OBJ_IMPACTO, d: "31/10/2026", k: [
            ["KR 1.1", "Atingir nota de NPS > 9,5", "", "9,5", "", "0,00%", "9,5", A],
            ["KR 1.2", "Atingir nota de CSAT > 9", "", "9", "", "0,00%", "9", A],
            ["KR 1.3", "Atingir nota de Score de Projetos > 9,5", "", "9,5", "", "0,00%", "9,5", A],
            ["KR 1.4", "Fazer 1 projeto de impacto social", "", "1", "", "0,00%", "1", N],
            ["KR 1.5", "Fazer 1 projeto de impacto", "", "1", "", "0,00%", "1", N]
          ]},
          { h: "INOVAÇÃO", o: OBJ_INOVACAO, d: "31/10/2026", k: [
            ["KR 1.1", "Realizar 5 squads de inovação.", "", "5", "", "0,00%", "5", A],
            ["KR 1.2", "Nivel de satisfação com a execução dos squads >= 75%", "", "70%", "", "0,00%", "70%", N],
            ["KR 1.3", "Taxa de 50% de aplicabilidade e replicabilidade nos squads executados", "", "50%", "", "0,00%", "50%", N]
          ]}
        ]
      },
      {
        t: "Diretoria de JF", c: "1º CICLO DE OKR", i: "01/01/2026", f: "30/04/2026",
        s: [
          { h: "OKR TÁTICO", o: OBJ_JF_TATICO, d: "30/04/2026", k: [
            ["KR 1.1", "Manter a Lucratividade => 75%", "", "75%", "92,12%", "", "-17%", C],
            ["KR 1.2", "ROI VP / Representatividade => 500%", "100%", "400%", "2531,97%", "", "-2132%", C],
            ["KR 1.3", "ROI Marketing => 200%", "100%", "200%", "12,91%", "", "187%", A],
            ["KR 1.4", "ROI Projetos => 2000%", "100%", "600%", "291,29%", "", "309%", A],
            ["KR 1.5", "ROI Negócios => 220%", "100%", "220%", "77,45%", "", "143%", A]
          ]},
          { h: "OKR OPERACIONAL", o: OBJ_JF_OPERACIONAL, d: "30/04/2026", k: [
            ["KR 1.1", "Tempo médio para a conclusão de contratos em 2 dias .", "", "2", "1", "", "", C],
            ["KR 1.2", "Comunicação com clientes referente a pagamentos <= 7 dias.", "", "7", "7", "", "0", C],
            ["KR 1.3", "Não ter clientes inadimplentes = 0", "", "0", "0", "", "0", C],
            ["KR 1.4", "Manter sempre o e DFC atualizado 95%", "", "95%", "100%", "", "-5%", C],
            ["KR 1.5", "Manter as planilhas atualizadas (ROI, Lucratividade) (P.E) (TODO MÊS)", "", "a cada mês", "100%", "", "0", C],
            ["KR 1.6", "Manter a assertividade entre o, Banco e DFC = 100%", "", "100%", "100%", "", "0%", C],
            ["KR 1.7", "Assessor com expertise nos trabalhos de sua responsábilidade", "", "100%", "100%", "", "0%", C],
            ["KR 1.8", "Atualizar os documentos de destrinchamento financeiro e juridico cada mês", "", "100%", "100%", "", "0%", C],
            ["KR 1.9", "Aplicar 4 ideias assertivas trazidas em reuniões", "", "100%", "100%", "", "0%", C]
          ]}
        ]
      },
      {
        t: "Diretoria de DHO", c: "1º CICLO DE OKR", i: "01/01/2026", f: "30/04/2026",
        s: [
          { h: "OKR TÁTICO", o: OBJ_DHO_1, d: "30/04/2026", k: [
            ["KR 1.1", "Pesquisa de clima organizacional", "85%", "85%", "87,5%", "103%", "-3%", C],
            ["KR 1.2", "Pesquisa de satisfação das ações de DHO", "9", "9", "8", "89%", "1", V],
            ["KR 1.3", "Taxa de retenção", "100%", "30%", "41%", "137%", "-11%", C]
          ]},
          { h: "OKR TÁTICO", o: OBJ_DHO_2, d: "30/04/2026", k: [
            ["KR 1.1", "Trazer ideias de melhorias internas", "2", "2", "2", "100%", "0", C, "jornada de onboarding e adição de novas perguntas base no doc de mentoria"],
            ["KR 1.2", "Converter ideias em squads", "1", "1", "1", "100%", "0", C, "squad de unificação da jornada de onboarding"],
            ["KR 1.3", "Satisfação com squads finalizados (cliente)", "10", "9", "", "0%", "9", N],
            ["KR 1.4", "Satisfação com squads finalizados (consultor)", "10", "9", "", "0%", "9", N]
          ]},
          { h: "OKR OPERACIONAL", o: OBJ_DHO_3, d: "30/04/2026", k: [
            ["KR 1.1", "Promover eventos educacionais", "2", "5", "6", "120%", "-1", C, "treinamento de feedback, gestão de tempo, excel, powerbi, autocad, flexsim"],
            ["KR 1.2", "Promover eventos de entretenimento", "3", "3", "4", "133%", "-1", C, "tarde de jogos online, tarde de jogos, tarde de coworking"],
            ["KR 1.3", "Promover eventos escapistas ou sensitivos", "3", "1", "2", "200%", "-1", C, "caça ao tesouro, dejincana"],
            ["KR 1.4", "Iniciar a estruturação das trilhas de desenvolvimento para 100% dos membros", "26", "26", "26", "100%", "0", C]
          ]},
          { h: "OKR OPERACIONAL", o: OBJ_DHO_4, d: "30/04/2026", k: [
            ["KR 1.1", "Realizar postagens no instagram interno", "54", "25", "28", "112%", "-3", C],
            ["KR 1.2", "Realizar postagens no instagram externo", "18", "10", "9", "90%", "1", V],
            ["KR 1.3", "Promover ações de DHO inovadoras", "2", "3", "1", "33%", "2", V, "decoração da dejpáscoa"],
            ["KR 1.4", "Realizar encontro de união entre o time", "1", "1", "1", "100%", "0", C],
            ["KR 1.5", "Visualizações nos posts", "400", "400", "1999,4", "500%", "-1599,4", C],
            ["KR 1.6", "Visualizações nos reels", "2000", "2000", "1569", "78%", "431", V],
            ["KR 1.7", "Estudo de temas de Gestão de Pessoas", "3", "4", "3", "75%", "1", C]
          ]}
        ]
      },
      {
        t: "Diretoria de Marketing", c: "1º CICLO DE OKR", i: "01/01/2026", f: "30/04/2026",
        s: [
          { h: "OKR TÁTICO", o: OBJ_MKT_ATRACAO, d: "Até 30/04", k: [
            ["KR 1.1", "Atrair 4.500 visitantes ao site, advindos do tráfego pago", "19.815", "4.500", "5.269", "117,09%", "-769", C],
            ["KR 1.2", "Atrair 1.150 visitantes ao site, advindos do tráfego orgânico", "1.071", "1.150", "859", "74,70%", "291", V],
            ["KR 1.3", "Manter um CTR >5% nas campanhas do Google Ads (Pago)", "4,76%", "5%", "5,45%", "109,00%", "-0,45%", C],
            ["KR 1.4", "Ter uma média de 4300 visualizações por reels do Instagram", "4209", "4300", "2640", "61,40%", "1660", V],
            ["KR 1.5", "Ter uma média de 4000 visualizações por post do Instagram", "3895", "4000", "3796", "94,90%", "204,00", V],
            ["KR 1.6", "Ter uma média de 800 impressões por post no LinkedIn", "750", "800", "626", "78,25%", "174,00", V]
          ]},
          { h: "OKR TÁTICO", o: OBJ_MKT_INBOUND, d: "Até 30/04", k: [
            ["KR 1.1", "Gerar 50 leads", "77", "50", "37", "74,00%", "13", V],
            ["KR 1.2", "Gerar 20 oportunidades", "-", "20", "15", "75,00%", "5", V],
            ["KR 1.3", "Atingir um faturamento de R$ 36.000,00", "R$ 36.000,00", "R$ 36.000,00", "R$ 1.519,90", "4,22%", "R$ 34.480,10", V],
            ["KR 1.4", "Vender 3 projetos", "3", "3", "1", "33,33%", "2", V],
            ["KR 1.4", "Realizar ações para o Dia do Consumidor de 2026", "100%", "100%", "100%", "100%", "0%", C]
          ]},
          { h: "OKR OPERACIONAL", o: "O: Se manter ativo nas plataformas digitais", d: "Até 30/04", k: [
            ["KR 1.1", "Postar 13 posts no Instagram", "18", "13", "15", "115,38%", "-2", C],
            ["KR 1.2", "Postar 5 reels no Instagram", "13", "5", "4", "80,00%", "1", V],
            ["KR 1.3", "Postar 10 posts no LinkedIn", "13", "10", "10", "100%", "0", C],
            ["KR 1.4", "Realizar 4 edições da DEJ News", "-", "4", "4", "100%", "0", C]
          ]},
          { h: "OKR OPERACIONAL", o: "O: Desenvolvimento interno dos assessores", d: "Até 30/04", k: [
            ["KR 1.1", "Artur terminar a gamificação", "100%", "100%", "100%", "100%", "0%", C],
            ["KR 1.2", "Giovanna terminar a gamificação", "100%", "100%", "100%", "100%", "0%", C],
            ["KR 1.3", "Bianca terminar a gamificação", "100%", "100%", "100%", "100%", "0%", C],
            ["KR 1.4", "Pedro terminar a gamificação", "100%", "100%", "100%", "100%", "0%", C],
            ["KR 1.5", "Andriele terminar a gamificação", "100%", "100%", "100%", "100%", "0%", C],
            ["KR 1.6", "Dar 6 treinamentos específicos da área de marketing (cada um vai fazer um)", "3", "6", "6", "100,00%", "0", C],
            ["KR 1.7", "Realizar 3 reuniões de 1 a 1 com cada assessor no ciclo", "3", "3", "3", "100,00%", "0", C],
            ["KR 1.8", "Realizar 2 imersões no ciclo", "2", "2", "3", "150,00%", "-1", C],
            ["KR 1.9", "Participar de uma masterclass juntos", "1", "1", "0", "0,00%", "1", N]
          ]}
        ]
      },
      {
        t: "Diretoria de Negócios", c: "1º CICLO DE OKR", i: "01/01/2026", f: "31/03/2026",
        s: [
          { h: "OKR TÁTICO", o: OBJ_NEG_TATICO, d: "31/03/2026", k: [
            ["KR 1.1", "Atingir R$22.500 de receita no Q1", "", "R$ 22.500,00", "R$ 33.202,65", "147,57%", "", C, "Ciclo comercial se estendeu."],
            ["KR 1.2", "Fechar no mínimo 4 projetos no Q1 com ticket médio >= R$ 6.000", "", "4", "2", "50,00%", "", V],
            ["KR 1.3", "Manter o ticket médio da consultoria >= R$ 6.000", "", "R$ 6.000,00", "R$ 11.986,01", "199,77%", "", C],
            ["KR 1.4", "Gerar pelo menos 23 diagnósticos qualificados", "", "23", "16", "69,57%", "", V],
            ["KR 1.5", "Manter uma taxa de fechamento ≥ 23%", "", "23,00%", "100%", "434,78%", "", C]
          ]},
          { h: "OKR OPERACIONAL", o: "O: Ser um time disciplinado e inteligente emocionalmente para superar as metas", d: "31/03/2026", k: [
            ["KR 1.1", "Gerar 23 diagnósticos qualificados no Q1", "", "23", "16", "69,57%", "0,00%", V],
            ["KR 1.2", "Garantir que 80% dos leads tenham potencial de ticket ≥ R$ 6.000", "", "80,00%", "100,00%", "125,00%", "100,00%", C],
            ["KR 1.3", "Executar mínimo de 170 ligações na semana para o outbound no Q1", "", "170", "72", "42,35%", "0,00%", V],
            ["KR 1.4", "Garantir taxa de fechamento ≥ 23%", "", "23%", "100%", "434,78%", "0,00%", C],
            ["KR 1.5", "Manter o CRM 100% atualizado", "", "100%", "100%", "100,00%", "0,00%", C],
            ["KR 1.6", "Fazer um role play na semana", "", "1", "1", "100,00%", "0,00%", C],
            ["KR 1.6", "Fazer 2 imersões no ciclo", "", "2", "2", "100,00%", "0,00%", C],
            ["KR 1.7", "Revisar templates e fluxos", "", "1", "1", "100,00%", "100,00%", C],
            ["KR 1.8", "Realizar 1 a 1 mensalmente", "", "1", "1", "100,00%", "100,00%", C],
            ["KR 1.9", "Apresentação do Ebook em grupo", "", "1", "1", "100,00%", "100,00%", C],
            ["KR 2.0", "Realizar 1 treinamento online/presencial", "", "6", "6", "100,00%", "0,00%", C]
          ]}
        ]
      },
      {
        t: "Diretoria de Projetos", c: "1º CICLO DE OKR", i: "01/01/2026", f: "30/04/2026",
        s: [
          { h: "Inovação", o: OBJ_PROJ_INOVACAO, d: "Até 30/04", k: [
            ["KR 1.1", "Realizar 2 squads de inovação", "2", "2", "2", "Não coletado", "0", C],
            ["KR 1.2", "Nota de 70% de satisfação na realização de squads", "77,80%", "70%", "", "Não coletado", "70,00%", A],
            ["KR 1.3", "Documentar e divulgar 100% cases de inovação aplicada", "", "100%", "", "Não coletado", "100,00%", P],
            ["KR 1.4", "Trazer 6 ideias para inovação", "-", "6,00", "4,00", "", "2,00", V]
          ]},
          { h: "Qualidade", o: "Padronizar e documentar nossas entregas, serviços e produtos, garantindo sua qualidade e relevância no mercado.", d: "Até 30/04", k: [
            ["KR 1.1", "Nota de 70% de satisfação na realização de squads", "77,80%", "70%", "", "Não coletado", "70,00%", A],
            ["KR 1.2", "Documentar e divulgar 100% cases de inovação aplicada", "", "100%", "", "Não coletado", "100,00%", A],
            ["KR 1.3", "Trazer 6 ideias para qualidade", "-", "6,00", "3", "50%", "3,00", V],
            ["KR 1.4", "Realizar 1 squad de qualidade", "-", "1", "1", "", "0", C]
          ]},
          { h: "Reincidência e Fidelização", o: OBJ_PROJ_REINCIDENCIA, d: "Até 30/04", k: [
            ["KR 1.1", "Atingir um faturamento de R$30000 advindo de projetos", "R$ 8.049,00", "R$ 30.000,00", "R$ 29.559,99", "98,53%", "R$ 440,01", V],
            ["KR 1.2", "Marcar reuniões de diagnóstico para oportunidades de venda", "3", "5", "2", "40,00%", "3", V],
            ["KR 1.3", "Alcançar uma taxa de conversão de 0,45 em reuniões de proposta para reincidência", "33,33%", "45,00%", "40,00%", "88,89%", "5,00%", V],
            ["KR 1.4", "Desenvolver entregas adicionais para agregar valor para reincidência", "3", "9,00", "9,00", "100,00%", "0,00", C, "", "Até 30/05"],
            ["KR 1.5", "Atingir nota 9 de NPS", "7", "9,00", "10", "Não coletado", "-1,00", C],
            ["KR 1.6", "Atingir nota 9 de CSAT", "7,5", "9,00", "9,5", "Não coletado", "-0,50", C],
            ["KR 1.7", "Atingir nota 9 de Score", "8", "9,00", "9,7", "Não coletado", "-0,70", C]
          ]}
        ]
      },
      {
        t: "Representatividade", c: "1º CICLO DE OKR", i: "01/01/2026", f: "30/04/2026",
        s: [
          { h: "OKR TÁTICO - EVOA", o: OBJ_REP_EVOA, d: "30/04/2026", k: [
            ["KR 1.1", "Adentrar ACIM e COPEJEM", "0", "2", "2", "100,00%", "0,00%", C],
            ["KR 1.2", "Venda de 1 projeto", "0", "1", "1", "100,00%", "0,00%", C],
            ["KR 1.3", "Participar de 1 evento com intuito de prospectar", "0", "1", "0", "0,00%", "100,00%", V],
            ["KR 1.4", "Participar todo mês de cada grupo", "4", "4", "2", "50,00%", "50,00%", V]
          ]},
          { h: "OKR TÁTICO - CONEXÃO DINÂMICA", o: OBJ_REP_CD, d: "30/04/2026", k: [
            ["KR 1.1", "Apresentar proposta para todas as empresas do CD 2025", "100%", "10", "8", "80,00%", "20,00%", V],
            ["KR 1.2", "Coletar feedbacks sobre o evento com empresas que já participaram", "80%", "10", "8", "80,00%", "20,00%", V],
            ["KR 1.3", "Ter 100% do evento estruturado", "100%", "100%", "100%", "100,00%", "0,00%", C],
            ["KR 1.4", "Atingir ao menos 10.000 de faturamento", "8.000", "10.000", "11.500", "115,00%", "-15,00%", C],
            ["KR 1.5", "Reunião com 5 empresas novas", "5", "5", "1", "20,00%", "80,00%", V],
            ["KR 1.6", "Realizar 4 benchs com EJs que realizam feiras similares", "0", "3", "3", "100,00%", "0,00%", C],
            ["KR 1.7", "Realizar 2 reuniões com cada squad", "1", "2", "1", "50,00%", "50,00%", V]
          ]}
        ]
      },
      {
        t: "Presidência", c: "1º CICLO DE OKR", i: "01/01/2026", f: "30/04/2026",
        s: [
          { h: "OKR TÁTICO", o: OBJ_PRES_TATICO, d: "30/04/2026", k: [
            ["KR 1.1", "Reunião com coordenador responsável", "", "1", "2", "200,00%", "-1", C],
            ["KR 1.2", "Realizar 3 benchs com outras EJs", "", "3", "3", "100,00%", "0", C, "agro, peryódica, conset"],
            ["KR 1.3", "Buscar novas formas de promover a DEJ no meio acadêmico", "", "0", "1", "0,00%", "-1", C]
          ]},
          { h: "OKR OPERACIONAL", o: OBJ_PRES_OPERACIONAL, d: "30/04/2026", k: [
            ["KR 1.1", "Realizar 1a1 com os diretores", "", "6", "6", "100,00%", "0", C],
            ["KR 1.2", "Participar de uma reunião mensal de cada diretoria", "", "20", "15", "75,00%", "5", V],
            ["KR 1.3", "Trazer 3 aprofundamentos de liderança para a direx", "", "3", "0", "0,00%", "3", V],
            ["KR 1.4", "Realizar o acompanhamento dos planejmentos estratégicos de cada diretoria", "", "80%", "80%", "100,00%", "0%", C]
          ]}
        ]
      }
    ]
  },

  // ============================================================
  // 2º CICLO
  // ============================================================
  {
    id: "c2",
    label: "2º Ciclo",
    period: "Abr – Jul/2026",
    boards: [
      {
        t: "OKR Estratégico DEJ", c: "ANUAL", i: "01/01/2026", f: "31/12/2026",
        s: [
          { h: "RESULTADO", o: OBJ_RESULTADO, d: "31/10/2026", k: [
            ["KR 1.1", "Participação de 50% do faturamento advindo da Diretoria Comercial", "", "50,0%", "", "0,00%", "50,0%", A],
            ["KR 1.2", "Participação de 25% do faturamento advindo da Diretoria de Projetos", "", "25,0%", "", "0,00%", "25,0%", A],
            ["KR 1.3", "Participação de 25% do faturamento advindo de Representatividade", "", "25,0%", "", "0,00%", "25,0%", A]
          ]},
          { h: "GENTE", o: OBJ_GENTE, d: "31/10/2026", k: [
            ["KR 1.1", "Atingir E-NPS >= 8,5", "", "8,5", "9,64", "113,41%", "-1,14", N],
            ["KR 1.2", "Fazer 100% dos PDI's do ciclo", "", "100%", "", "0,00%", "100%", N],
            ["KR 1.3", "Nível de satisfação dos membros com capacitações, eventos internos >= 87%", "", "8,5", "", "0,00%", "8,5", N],
            ["KR 1.4", "Atingir retenção >= 30%", "", "30%", "", "0,00%", "30%", N],
            ["KR 1.5", "Clima organizacional referente a pertencimento e segurança dos membros da EJ >= 80%", "", "80%", "", "0,00%", "80%", N]
          ]},
          { h: "IMPACTO", o: OBJ_IMPACTO, d: "31/10/2026", k: [
            ["KR 1.1", "Atingir nota de NPS > 9,5", "", "9,5", "", "0,00%", "9,5", N],
            ["KR 1.2", "Atingir nota de CSAT > 9", "", "9", "", "0,00%", "9", N],
            ["KR 1.3", "Atingir nota de Score de Projetos > 9,5", "", "9,5", "", "0,00%", "9,5", N],
            ["KR 1.4", "Fazer 1 projeto de impacto social", "", "1", "", "0,00%", "1", N],
            ["KR 1.5", "Fazer 1 projeto de impacto", "", "1", "", "0,00%", "1", N]
          ]},
          { h: "INOVAÇÃO", o: OBJ_INOVACAO, d: "31/10/2026", k: [
            ["KR 1.1", "Realizar 5 squads de inovação.", "", "5", "", "0,00%", "5", N],
            ["KR 1.2", "Nivel de satisfação com a execução dos squads >= 75%", "", "70%", "", "0,00%", "70%", N],
            ["KR 1.3", "Taxa de 50% de aplicabilidade e replicabilidade nos squads executados", "", "50%", "", "0,00%", "50%", N]
          ]}
        ]
      },
      {
        t: "Diretoria de JF", c: "2º CICLO DE OKR", i: "01/05/2026", f: "31/07/2026",
        s: [
          { h: "OKR TÁTICO", o: OBJ_JF_TATICO, d: "31/07/2026", k: [
            ["KR 1.1", "Manter a Lucratividade => 75%", "", "75%", "80%", "", "-5%", C],
            ["KR 1.2", "ROI VP / Representatividade => 800%", "100%", "800%", "62,00%", "", "738%", V],
            ["KR 1.3", "ROI Marketing => 220%", "100%", "220%", "0,00%", "", "220%", V],
            ["KR 1.4", "ROI Projetos => 800%", "100%", "800%", "5974,18%", "", "-5174%", C],
            ["KR 1.5", "ROI Negócios => 220%", "100%", "220%", "633,19%", "", "-413%", C]
          ]},
          { h: "OKR OPERACIONAL", o: OBJ_JF_OPERACIONAL, d: "31/07/2026", k: [
            ["KR 1.1", "Tempo médio para a conclusão de contratos em 1 dia", "", "1", "1", "", "0", C],
            ["KR 1.2", "Comunicação com clientes referente a pagamentos <= 7 dias.", "", "7", "5", "", "2", C],
            ["KR 1.3", "Não ter clientes inadimplentes = 0", "", "0", "0", "", "0", C],
            ["KR 1.4", "Manter um caixa de segurança de R$ 15000,00", "", "R$ 15.000,00", "R$ 5.500,00", "", "R$ 9.500,00", A],
            ["KR 1.5", "Investir o caixa de segurança", "", "100%", "100%", "", "0%", C],
            ["KR 1.6", "Fazer a DEJ se pagar", "", "100%", "86%", "", "14%", P],
            ["KR 1.8", "Atualizar os documentos de destrinchamento financeiro e juridico cada mês", "", "100%", "100%", "", "0%", C],
            ["KR 1.9", "Começar a restituição do dinheiro dos impostos", "", "100%", "0,00%", "", "100%", P]
          ]}
        ]
      },
      {
        t: "Diretoria de DHO", c: "2º CICLO DE OKR", i: "01/05/2026", f: "31/07/2026",
        s: [
          { h: "OKR TÁTICO", o: OBJ_DHO_1, d: "31/07/2026", k: [
            ["KR 1.1", "Pesquisa de clima organizacional", "85%", "80%", "82%", "103%", "-2%", C],
            ["KR 1.2", "Pesquisa de satisfação das ações de DHO", "9", "9", "8,89", "99%", "0,11", V],
            ["KR 1.3", "Taxa de retenção", "100%", "100%", "100%", "100%", "0%", A]
          ]},
          { h: "OKR TÁTICO", o: OBJ_DHO_2, d: "31/07/2026", k: [
            ["KR 1.1", "Trazer ideias de melhorias internas", "1", "1", "2", "200%", "-1", C, "revisão da id do@dinamicaps, repasses das diretorias na rg"],
            ["KR 1.2", "Converter ideias em squads", "1", "1", "0", "0%", "1", V, "não foi prioridade"],
            ["KR 1.3", "Satisfação com squads finalizados (cliente)", "10", "10", "", "0%", "10", N],
            ["KR 1.4", "Satisfação com squads finalizados (consultor)", "10", "10", "", "0%", "10", N]
          ]},
          { h: "OKR OPERACIONAL", o: OBJ_DHO_3, d: "31/07/2026", k: [
            ["KR 1.1", "Promover eventos educacionais", "2", "4", "3", "75%", "1", V, "dejreporter (3)"],
            ["KR 1.2", "Promover eventos de entretenimento", "3", "1", "1", "100%", "0", C, "dejulina"],
            ["KR 1.3", "Promover eventos escapistas ou sensitivos", "3", "1", "0", "0%", "1", V],
            ["KR 1.4", "Iniciar a estruturação das trilhas de desenvolvimento para 100% dos membros", "26", "26", "26", "100%", "0", C]
          ]},
          { h: "OKR OPERACIONAL", o: OBJ_DHO_4, d: "31/07/2026", k: [
            ["KR 1.1", "Realizar postagens no instagram interno", "54", "15", "17", "113%", "-2", C],
            ["KR 1.2", "Realizar postagens no instagram externo", "18", "10", "13", "130%", "-3", C],
            ["KR 1.3", "Promover ações de DHO inovadoras", "2", "3", "3", "100%", "0", C, "decoração da copa e story de apostas do placar da copa, imersão de conteúdos de dho"],
            ["KR 1.4", "Realizar encontro de união entre o time", "1", "1", "1", "100%", "0", C, "Imersão da DEJuline"],
            ["KR 1.5", "Visualizações nos posts", "400", "1700", "2072", "122%", "-372", C],
            ["KR 1.6", "Visualizações nos reels", "2000", "2000", "2115", "106%", "-115", C],
            ["KR 1.7", "Estudo de temas de Gestão de Pessoas", "3", "3", "3", "100%", "0", C, "imersivão dho"],
            ["KR 1.8", "Interações nas publicações (posts e reels)", "-", "190", "1899", "999%", "-1709", C]
          ]}
        ]
      },
      {
        t: "Diretoria de Marketing", c: "2º CICLO DE OKR", i: "01/05/2026", f: "31/07/2026",
        s: [
          { h: "OKR TÁTICO · GESTOR DE TRÁFEGO PAGO", o: OBJ_MKT_ATRACAO, d: "Até 31/07", k: [
            ["KR 1.1", "Atrair 1.350 visitantes ao site, advindos do tráfego pago", "11.895", "1.350", "1.346", "99,70%", "4", V],
            ["KR 1.2", "Manter um CTR >6% nas campanhas", "3,06%", "6,00%", "8,55%", "142,50%", "-2,55%", C],
            ["KR 1.3", "Recuperarmos o Ad Grants", "-", "100,00%", "0,00%", "0,00%", "100,00%", V],
            ["KR 1.4", "Atingirmos um Custo Por Clique (CPC) de até R$ 5,00", "-", "R$ 5,00", "R$ 3,31", "66,20%", "169,00%", C]
          ]},
          { h: "OKR TÁTICO · GESTOR DE SEO E CONTEÚDO", o: OBJ_MKT_ATRACAO, d: "Até 31/07", k: [
            ["KR 1.1", "Atrair 600 visitantes ao site, advindos do tráfego orgânico", "780", "600", "540", "90,00%", "60", V],
            ["KR 1.2", "Finalizar as páginas novas do site", "-", "24", "24", "100,00%", "0", C],
            ["KR 1.3", "Começar a fazer o site do CD", "-", "100%", "100%", "100,00%", "0%", C],
            ["KR 1.4", "Desempenho estimado da Home (PageSpeed) - SEO", "-", "75%", "100%", "133,33%", "0", C]
          ]},
          { h: "OKR TÁTICO · GESTORA DE AUTOMAÇÃO E RELACIONAMENTO", o: OBJ_MKT_ATRACAO, d: "Até 31/07", k: [
            ["KR 1.1", "Realizar 6 edições da DEJ News", "6", "6", "6", "100,00%", "0", C],
            ["KR 1.2", "Atingir uma média de 250 visualizações por News (no RD Station)", "-", "250", "293", "117,20%", "-43", C],
            ["KR 1.3", "Reformular os fluxos atuais de email", "-", "47", "0", "0,00%", "47", N]
          ]},
          { h: "OKR TÁTICO · GESTORA DE MÍDIAS (DESIGNER)", o: OBJ_MKT_ATRACAO, d: "Até 31/07", k: [
            ["KR 1.1", "Postar 12 posts no Instagram", "14", "12", "12", "100,00%", "0", C],
            ["KR 1.2", "Ter uma média de 3000 impressões por post do Instagram", "2795", "3000", "2862", "95,40%", "138", V],
            ["KR 1.3", "Postar 5 posts no LinkedIn", "10", "5", "5", "100,00%", "0", C],
            ["KR 1.4", "Ter uma média de 700 impressões por post no LinkedIn", "800", "700", "977", "139,57%", "-277", C]
          ]},
          { h: "OKR TÁTICO · GESTORA DE MÍDIAS (VIDEOMAKER)", o: OBJ_MKT_ATRACAO, d: "Até 31/07", k: [
            ["KR 1.1", "Postar 7 reels no Instagram", "12", "7", "6", "85,71%", "1", V],
            ["KR 1.2", "Ter uma média de 2.300 visualizações por reels do Instagram", "3.541", "2.300", "2.088", "90,78%", "212", V]
          ]},
          { h: "OKR TÁTICO", o: OBJ_MKT_INBOUND, d: "Até 31/07", k: [
            ["KR 1.1", "Gerar 50 leads", "70", "50", "23", "46%", "27", V],
            ["KR 1.2", "Gerar 10 oportunidades", "-", "10", "2", "20%", "8", V],
            ["KR 1.3", "Atingir um faturamento de R$ 65.480,00", "R$ 34.000,00", "R$ 65.480,00", "0", "0%", "R$ 65.480,00", V],
            ["KR 1.4", "Vender 3 projetos", "3", "3", "0", "0%", "3", V]
          ]}
        ]
      },
      {
        t: "Diretoria de Negócios", c: "2º CICLO DE OKR", i: "01/04/2026", f: "30/06/2026",
        s: [
          { h: "OKR TÁTICO", o: OBJ_NEG_TATICO, d: "30/06/2026", k: [
            ["KR 1.1", "Gerar receita no Q2", "R$ 0,00", "R$ 0,00", "R$ 0,00", "#DIV/0!", "", V],
            ["KR 1.1", "Atingir R$11.797,35 de receita no Q2", "R$ 33.202,65", "R$ 11.797,35", "R$ 13.550,44", "114,86%", "", C],
            ["KR 1.2", "Fechar no mínimo 2 projetos no Q2 com ticket médio >= R$ 11.986,01", "2", "2", "1", "50,00%", "", V],
            ["KR 1.3", "Manter o ticket médio da consultoria >= R$ 11.986,01", "R$ 16.601,33", "R$ 11.986,01", "R$ 13.550,44", "113,05%", "", C],
            ["KR 1.4", "Gerar pelo menos 20 diagnósticos qualificados", "10", "20", "13", "65,00%", "", V],
            ["KR 1.5", "Manter uma taxa de fechamento ≥ 20%", "40,00%", "20,00%", "100%", "500,00%", "", C]
          ]},
          { h: "OKR OPERACIONAL", o: OBJ_NEG_OPERACIONAL, d: "30/06/2026", k: [
            ["KR 1.0", "Gerar 20 diagnósticos no Q2", "10", "20", "13", "65,00%", "0,00%", V],
            ["KR 1.1", "Gerar 5 oportunidades qualificados para o Conexão Dinâmica", "", "5", "15", "300,00%", "0,00%", C],
            ["KR 1.2", "Garantir que 80% dos leads tenham potencial de ticket ≥ R$ 11.986,01", "100,00%", "80,00%", "25%", "31,25%", "100,00%", A],
            ["KR 1.3", "Fazer no mínimo 120 interações na semana", "0", "120", "88", "73,33%", "0,00%", V],
            ["KR 1.4", "Garantir taxa de fechamento ≥ 40%", "100,00%", "40%", "100%", "250,00%", "0,00%", A],
            ["KR 1.5", "Manter o CRM 100% atualizado", "100,00%", "100%", "100,00%", "100,00%", "0,00%", C],
            ["KR 1.6", "Fazer um role play na semana", "1", "1", "0", "0,00%", "0,00%", A],
            ["KR 1.6", "Fazer 2 imersões no ciclo", "2", "2", "1", "50,00%", "0,00%", A],
            ["KR 1.7", "Revisar templates e fluxos", "1", "1", "1", "100,00%", "100,00%", C],
            ["KR 1.8", "Realizar 1 a 1 mensalmente", "1", "1", "1", "100,00%", "100,00%", C],
            ["KR 1.9", "Aplicar o treinamento online/presencial em uma reunião", "1", "1", "1", "100,00%", "100,00%", C],
            ["KR 2.0", "Realizar 1 treinamento online/presencial", "6", "6", "6", "100,00%", "0,00%", C]
          ]}
        ]
      },
      {
        t: "Comercial", c: "2º CICLO DE OKR", i: "01/07/2026", f: "31/09/2026",
        s: [
          { h: "OKR TÁTICO", o: "O: Otimizar a abordagem de leads para capturar oportunidades no momento ideal de compra, alcançando grandes resultados e se tornando a maior diretoria de vendas do Paraná.", d: "31/09/2026", k: [
            ["KR 1.1", "Abordar leads inbound em até 10 minutos", "02:00:00", "00:10:00", "", "109,09%", "00:10:00", N],
            ["KR 1.2", "Atingir R$ 18.000,00 de Receita Comercial", "-", "R$ 18.000,00", "R$ 0,00", "0,00%", "R$ 18.000,00", N],
            ["KR 1.3", "Vender 2 projetos que passem pela metodologia do Funil em Y", "3", "2", "0", "0,00%", "2", N]
          ]},
          { h: "OKR OPERACIONAL", o: "O: Realizar um estudo estratégico para identificar nosso diferencial e compreender a concorrência, fortalecendo nossa atuação no mercado.", d: "31/09/2026", k: [
            ["KR 1.1", "", "", "", "", "", "", N],
            ["KR 1.2", "", "", "", "", "", "", N],
            ["KR 1.3", "", "", "", "", "", "", N]
          ]},
          { h: "OKR OPERACIONAL", o: "O: Possibilitar o desenvolvimento de todos os membros do comercial, promovendo crescimento contínuo e excelência.", d: "31/09/2026", k: [
            ["KR 1.1", "Ter 2 treinamentos no ciclo", "3", "2", "0", "0%", "2", N],
            ["KR 1.2", "Realizar 2 práticas (diagnóstico/proposta)", "2", "2", "0", "0%", "2", N],
            ["KR 1.3", "Realizar 1 imersão no ciclo", "1", "1", "0", "0%", "1", N]
          ]}
        ]
      },
      {
        t: "Diretoria de Projetos", c: "2º CICLO DE OKR", i: "01/05/2026", f: "31/07/2026",
        s: [
          { h: "Inovação / Qualidade", o: OBJ_PROJ_INOVACAO, d: "Até 31/07", k: [
            ["KR 1.1", "Trazer 1 ideia que se tornou squad", "2", "1", "2", "Não coletado", "-1", C],
            ["KR 1.2", "Nota de 70% de satisfação na realização de squads finalizados", "77,80%", "70%", "", "Não coletado", "70,00%", N],
            ["KR 1.3", "Documentar e divulgar 100% dos squads aplicados", "", "100%", "50,00%", "Não coletado", "50,00%", V],
            ["KR 1.4", "Manter 3 squads rodando ao longo do ciclo", "-", "3,00", "4,00", "", "-1,00", C]
          ]},
          { h: "Reincidência e Fidelização", o: OBJ_PROJ_REINCIDENCIA, d: "Até 31/07", k: [
            ["KR 1.1", "Atingir um faturamento de R$30220,01 advindo de projetos", "R$ 8.049,00", "R$ 30.220,01", "R$ 13.143,20", "43,49%", "R$ 17.076,81", V],
            ["KR 1.2", "Marcar reuniões de diagnóstico para oportunidades de venda", "3", "5", "6", "120,00%", "-1", C],
            ["KR 1.3", "Marcar reuniões de proposta para oportunidades de venda", "", "3", "6", "", "", C],
            ["KR 1.3", "Alcançar uma taxa de conversão de 0,8 em reuniões de proposta para reincidência", "33,33%", "80,00%", "", "0,00%", "80,00%", V],
            ["KR 1.4", "Desenvolver entregas adicionais para agregar valor para reincidência (colocada no OKR de cada projeto)", "", "", "", "#DIV/0!", "0,00", N],
            ["KR 1.5", "Atingir nota 9 de NPS", "9,2", "9,00", "9,9", "Não coletado", "-0,90", C],
            ["KR 1.6", "Atingir nota 9 de CSAT", "9", "9,00", "9,5", "Não coletado", "-0,50", C],
            ["KR 1.7", "Atingir nota 9,5 de Score", "9,4", "9,50", "9,7", "Não coletado", "-0,20", C]
          ]},
          { h: "Projetos", o: "Garantir a boa qualidade de projetos sempre, e a boa eficiência da equipe", d: "Até 31/07", k: [
            ["KR 1.3", "Apresentar 1 case no mga jr 1", "-", "1,00", "0", "0%", "1,00", V],
            ["KR 1.4", "Realizar 2 treinamentos para a dinâmica", "-", "2", "2", "", "0", C]
          ]}
        ]
      },
      {
        t: "Representatividade", c: "2º CICLO DE OKR", i: "01/05/2026", f: "31/07/2026",
        s: [
          { h: "OKR TÁTICO - EVOA", o: OBJ_REP_EVOA, d: "30/04/2026", k: [
            ["KR 1.1", "Gerar uma oportunidade advindo da EVOA, ACIM ou COPEJEM", "0", "1", "0", "0,00%", "100,00%", A],
            ["KR 1.2", "Vender um projeto", "1", "1", "0", "0,00%", "100,00%", A],
            ["KR 1.3", "Mapear 1 evento com intuito de prospectar", "0", "1", "0", "0,00%", "100,00%", A],
            ["KR 1.4", "Participar todo mês de cada grupo", "1", "3", "2", "66,67%", "33,33%", A]
          ]},
          { h: "OKR TÁTICO - CONEXÃO DINÂMICA", o: OBJ_REP_CD, d: "30/04/2026", k: [
            ["KR 1.1", "Reter metade das empresas de 2025", "4,5", "5", "3", "60,00%", "40,00%", A],
            ["KR 1.2", "Conseguir 12 empresas participantes para o evento", "0", "12", "3", "25,00%", "75,00%", A],
            ["KR 1.3", "Atingir R$ 75.000 em faturamento", "43.000,00", "64.500,00", "0", "0,00%", "100,00%", A],
            ["KR 1.4", "Reunião com 30 'novas empresas", "30", "30", "21", "70,00%", "30,00%", A],
            ["KR 1.5", "Fechamento de 25%", "30%", "33%", "0%", "0,00%", "100,00%", A],
            ["KR 1.6", "Conseguir 3 empresas parceiras não pagantes", "2", "3", "0", "0,00%", "100,00%", A],
            ["KR 1.7", "Realizar 1 reunião mensal com cada squad", "1", "3", "2", "66,67%", "33,33%", A]
          ]}
        ]
      },
      {
        t: "Presidência", c: "2º CICLO DE OKR", i: "01/05/2026", f: "31/07/2026",
        s: [
          { h: "OKR TÁTICO", o: OBJ_PRES_TATICO, d: "31/07/2026", k: [
            ["KR 1.1", "Realizar Reunião Mensal com o Coordenador Responsável", "2", "3", "0", "", "3", N],
            ["KR 1.2", "Realizar 3 benchs com outras EJs", "3", "3", "0", "", "3", N],
            ["KR 1.3", "Trazer outras EJs para se apresentar para a DEJ", "0", "3", "0", "", "3", N],
            ["KR 1.3", "Nota de acessibilidade com os membros >= 75", "0", "75", "0", "", "75", N]
          ]},
          { h: "OKR OPERACIONAL", o: OBJ_PRES_OPERACIONAL, d: "31/07/2026", k: [
            ["KR 1.1", "Realizar 1a1 com os diretores", "", "18", "", "", "18", N],
            ["KR 1.2", "Participar de uma reunião mensal de cada diretoria", "", "15", "", "", "15", N],
            ["KR 1.4", "Nota de acompanhamento dos planejmentos estratégicos de cada diretoria >=80", "", "80%", "", "", "80%", N]
          ]}
        ]
      }
    ]
  },

  // ============================================================
  // 3º CICLO
  // ============================================================
  {
    id: "c3",
    label: "3º Ciclo",
    period: "Jul – Set/2026",
    boards: [
      {
        t: "Diretoria de Negócios", c: "3º CICLO DE OKR", i: "01/07/2026", f: "30/09/2026",
        s: [
          { h: "OKR TÁTICO", o: OBJ_NEG_TATICO, d: "01/07/2026", k: [
            ["KR 1.1", "Gerar receita no Q3", "R$ 0,00", "R$ 60.000,00", "R$ 46.237,99", "77,06%", "", A],
            ["KR 1.1", "Atingir R$21.623,46 de receita no Q3", "R$ 46.753,09", "R$ 21.623,46", "R$ 46.237,99", "213,83%", "", C],
            ["KR 1.2", "Fechar no mínimo 2 projetos no Q2 com ticket médio >= R$ 13.550,44", "2", "2", "2", "100,00%", "", C],
            ["KR 1.3", "Manter o ticket médio da consultoria >= R$13.550,44", "R$ 16.601,33", "R$ 13.550,44", "R$ 23.118,99", "170,61%", "", C],
            ["KR 1.4", "Gerar pelo menos 9 diagnósticos qualificados", "13", "9", "4", "44,44%", "", A],
            ["KR 1.5", "Manter uma taxa de fechamento ≥ 60% (anual)", "60%", "60,00%", "45%", "75,00%", "", A]
          ]},
          { h: "OKR OPERACIONAL", o: OBJ_NEG_OPERACIONAL, d: "01/07/2026", k: [
            ["KR 1.0", "Gerar 9 diagnósticos qualificados no Q3", "13", "9", "4", "44,44%", "0,00%", A],
            ["KR 1.1", "Gerar 30 oportunidades qualificados para o Conexão Dinâmica", "15", "30", "39", "130,00%", "0,00%", C],
            ["KR 1.2", "Garantir que 80% dos leads tenham potencial de ticket ≥ R$ 13.550,44", "100,00%", "80,00%", "", "0,00%", "100,00%", A],
            ["KR 1.3", "Fazer no mínimo 120 interações na semana", "88", "120", "220", "183,33%", "0,00%", A],
            ["KR 1.4", "Garantir taxa de fechamento ≥ 60%", "100,00%", "60%", "", "0,00%", "0,00%", A],
            ["KR 1.5", "Manter o CRM 100% atualizado", "100,00%", "100%", "100,00%", "100,00%", "0,00%", A],
            ["KR 1.6", "Fazer um role play na semana", "1", "1", "1", "100,00%", "0,00%", C],
            ["KR 1.6", "Fazer 1 imersões no ciclo", "2", "1", "1", "100,00%", "0,00%", C],
            ["KR 1.7", "Revisar templates e fluxos", "1", "1", "1", "100,00%", "100,00%", C],
            ["KR 1.8", "Realizar 1 a 1 mensalmente", "1", "1", "1", "100,00%", "100,00%", A],
            ["KR 1.9", "Aplicar o treinamento online/presencial em uma reunião", "1", "1", "0", "0,00%", "#DIV/0!", A],
            ["KR 2.0", "Realizar 1 treinamento online/presencial", "6", "6", "6", "100,00%", "0,00%", C]
          ]}
        ]
      }
    ]
  }
];

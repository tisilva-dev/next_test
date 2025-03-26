/**
 * Serviço de IA para geração de sugestões
 * 
 * Este serviço implementa funcionalidades de IA para
 * gerar sugestões de texto baseadas em padrões e contexto.
 */

interface Lembrete {
  id: number;
  texto: string;
  data: string;
  prioridade: number;
  concluido: boolean;
  categoria?: string | null;
  descricao?: string | null;
}

// Lista de sugestões padrão para quando não houver lembretes
const SUGESTOES_PADRAO = [
  'Lembre-se de',
  'Verificar',
  'Confirmar',
  'Agendar',
  'Preparar',
  'Revisar',
  'Comprar',
  'Pagar',
  'Enviar',
  'Receber',
  'Entregar',
  'Participar',
  'Organizar',
  'Limpar',
  'Atualizar',
  'Verificar',
  'Confirmar',
  'Finalizar',
  'Iniciar',
  'Continuar'
];

// Padrões comuns de lembretes
const PADROES_COMUNS = [
  'Reunião com',
  'Prazo para',
  'Entrega de',
  'Pagamento de',
  'Compra de',
  'Consulta com',
  'Aniversário de',
  'Evento:',
  'Projeto:',
  'Tarefa:',
  'Relatório de',
  'Apresentação para',
  'Treinamento de',
  'Manutenção de',
  'Revisão de'
];

// Categorias comuns
const CATEGORIAS_COMUNS = [
  'Trabalho',
  'Pessoal',
  'Saúde',
  'Finanças',
  'Família',
  'Amigos',
  'Estudos',
  'Lazer',
  'Casa',
  'Compras'
];

/**
 * Gera sugestões de texto baseadas no contexto atual
 * 
 * @param lembretes - Array de lembretes existentes
 * @param textoAtual - Texto atual que está sendo digitado
 * @returns Array de sugestões de texto
 */
export function gerarSugestoes(lembretes: Lembrete[], textoAtual: string): string[] {
  // Se não houver texto, retorna sugestões padrão
  if (!textoAtual.trim()) {
    return gerarSugestoesPadrao();
  }

  // Divide o texto em palavras
  const palavras = textoAtual.toLowerCase().split(' ');
  const ultimaPalavra = palavras[palavras.length - 1];

  // Gera sugestões baseadas no contexto
  const sugestoesContexto = gerarSugestoesContexto(lembretes, palavras);
  
  // Gera sugestões baseadas na última palavra
  const sugestoesPalavra = gerarSugestoesPalavra(ultimaPalavra);

  // Combina e remove duplicatas
  const todasSugestoes = [...new Set([...sugestoesContexto, ...sugestoesPalavra])];

  // Limita o número de sugestões
  return todasSugestoes.slice(0, 5);
}

/**
 * Gera sugestões padrão quando não há contexto
 * 
 * @returns Array de sugestões padrão
 */
function gerarSugestoesPadrao(): string[] {
  const sugestoes = [
    ...SUGESTOES_PADRAO,
    ...PADROES_COMUNS,
    ...CATEGORIAS_COMUNS.map(cat => `Categoria: ${cat}`)
  ];

  // Embaralha as sugestões
  return sugestoes.sort(() => Math.random() - 0.5).slice(0, 5);
}

/**
 * Gera sugestões baseadas no contexto dos lembretes existentes
 * 
 * @param lembretes - Array de lembretes existentes
 * @param palavras - Array de palavras do texto atual
 * @returns Array de sugestões baseadas no contexto
 */
function gerarSugestoesContexto(lembretes: Lembrete[], palavras: string[]): string[] {
  const sugestoes: string[] = [];

  // Adiciona sugestões baseadas em padrões comuns
  PADROES_COMUNS.forEach(padrao => {
    if (palavras.some(palavra => palavra.includes(padrao.toLowerCase()))) {
      sugestoes.push(padrao);
    }
  });

  // Adiciona sugestões baseadas em categorias
  CATEGORIAS_COMUNS.forEach(categoria => {
    if (palavras.some(palavra => palavra.includes(categoria.toLowerCase()))) {
      sugestoes.push(`Categoria: ${categoria}`);
    }
  });

  // Se houver lembretes, analisa padrões
  if (lembretes.length > 0) {
    // Analisa palavras frequentes nos lembretes
    const palavrasFrequentes = analisarPalavrasFrequentes(lembretes);
    palavrasFrequentes.forEach(palavra => {
      if (palavras.some(p => p.includes(palavra.toLowerCase()))) {
        sugestoes.push(palavra);
      }
    });
  }

  return sugestoes;
}

/**
 * Gera sugestões baseadas na última palavra digitada
 * 
 * @param ultimaPalavra - Última palavra digitada
 * @returns Array de sugestões baseadas na palavra
 */
function gerarSugestoesPalavra(ultimaPalavra: string): string[] {
  const sugestoes: string[] = [];

  // Ignora palavras muito curtas
  if (ultimaPalavra.length < 2) return sugestoes;

  // Verifica sugestões padrão que começam com a palavra
  SUGESTOES_PADRAO.forEach(sugestao => {
    if (sugestao.toLowerCase().startsWith(ultimaPalavra)) {
      sugestoes.push(sugestao);
    }
  });

  // Verifica padrões comuns que começam com a palavra
  PADROES_COMUNS.forEach(padrao => {
    if (padrao.toLowerCase().startsWith(ultimaPalavra)) {
      sugestoes.push(padrao);
    }
  });

  // Verifica categorias que começam com a palavra
  CATEGORIAS_COMUNS.forEach(categoria => {
    if (categoria.toLowerCase().startsWith(ultimaPalavra)) {
      sugestoes.push(`Categoria: ${categoria}`);
    }
  });

  return sugestoes;
}

/**
 * Analisa palavras frequentes nos lembretes existentes
 * 
 * @param lembretes - Array de lembretes existentes
 * @returns Array de palavras frequentes
 */
function analisarPalavrasFrequentes(lembretes: Lembrete[]): string[] {
  const palavras: { [key: string]: number } = {};

  // Conta frequência de palavras
  lembretes.forEach(lembrete => {
    const palavrasLembrete = lembrete.texto.toLowerCase().split(' ');
    palavrasLembrete.forEach(palavra => {
      if (palavra.length > 2) { // Ignora palavras muito curtas
        palavras[palavra] = (palavras[palavra] || 0) + 1;
      }
    });
  });

  // Ordena por frequência e retorna as mais comuns
  return Object.entries(palavras)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([palavra]) => palavra);
} 
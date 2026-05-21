/**
 * Tipos e Interfaces
 */
interface Produto {
  nome: string;
  preco: number;
}
interface ItemCarrinho {
  nome: string;
  preco: number;
  quantidade: number;
}
interface Carrinho {
  [produtoId: string]: ItemCarrinho;
}
interface Depoimento {
  id: number;
  name: string;
  email: string;
  body: string;
}
declare enum Tema {
  LIGHT = 'light',
  DARK = 'dark',
}
/**
 * Classe para gerenciar temas
 */
declare class GerenciadorTema {
  private readonly STORAGE_KEY;
  private readonly BTN_ID;
  /**
   * Aplica o tema salvo ou padrão
   */
  aplicarTema(tema?: string): void;
  /**
   * Alterna entre temas claro e escuro
   */
  alternarTema(): void;
  /**
   * Atualiza o texto e estilo do botão de tema
   */
  private atualizarBotao;
}
/**
 * Classe para gerenciar cálculos de total
 */
declare class CalculadoraTotal {
  /**
   * Calcula o total baseado nos checkboxes marcados
   */
  calcularTotal(): void;
  /**
   * Formata número para moeda brasileira
   */
  private formatarMoeda;
}
/**
 * Classe para carregar e exibir depoimentos
 */
declare class CarregadorDepoimentos {
  private readonly API_URL;
  private readonly CONTAINER_ID;
  /**
   * Carrega depoimentos da API de forma assíncrona
   */
  carregar(): Promise<void>;
  /**
   * Renderiza os depoimentos no container
   */
  private renderizar;
  /**
   * Cria HTML de um card de depoimento
   */
  private criarCardDepoimento;
  /**
   * Exibe mensagem de erro
   */
  private exibirErro;
}
/**
 * Classe para gerenciar eventos do DOM
 */
declare class GerenciadorEventos {
  private calculadora;
  private gerenciadorTema;
  private carregadorDepoimentos;
  constructor();
  /**
   * Inicializa todos os event listeners
   */
  inicializar(): void;
  /**
   * Configura listeners para checkboxes de produtos
   */
  private configurarCheckboxes;
  /**
   * Configura listeners para inputs de quantidade
   */
  private configurarInputsQuantidade;
  /**
   * Configura listeners para alternância de tema
   */
  private configurarTema;
  /**
   * Carrega depoimentos
   */
  private carregarDepoimentos;
}
/**
 * Função para adicionar produto ao carrinho
 */
declare function adicionarAoCarrinho(
  produtoId: string,
  nomeProduto: string,
  preco: number
): void;
declare const gerenciador: GerenciadorEventos;

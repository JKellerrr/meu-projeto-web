/**
 * Tipos e Interfaces para carrinho
 */
type CarrinhoRecord = Record<string, ItemCarrinho>;
interface ItemCarrinho {
  nome: string;
  preco: number;
  quantidade: number;
}
interface Produto {
  nome: string;
  preco: number;
}
/**
 * Catálogo de produtos
 */
declare const produtos: Record<string, Produto>;
/**
 * Classe para gerenciar o carrinho de compras
 */
declare class GerenciadorCarrinho {
  private readonly STORAGE_KEY;
  private readonly CONTAINER_ID;
  /**
   * Carrega o carrinho do localStorage
   */
  private carregarCarrinho;
  /**
   * Salva o carrinho no localStorage
   */
  private salvarCarrinho;
  /**
   * Remove um item do carrinho
   */
  removerDoCarrinho(produtoId: string): void;
  /**
   * Atualiza a quantidade de um produto no carrinho
   */
  atualizarQuantidade(produtoId: string, novaQuantidade: number): void;
  /**
   * Calcula o total do carrinho
   */
  private calcularTotal;
  /**
   * Formata número para moeda brasileira
   */
  private formatarMoeda;
  /**
   * Exibe o carrinho na página
   */
  exibir(): void;
  /**
   * Cria uma linha da tabela para um item do carrinho
   */
  private criarLinhaTabela;
}
/**
 * Instância global do gerenciador de carrinho
 */
declare const gerenciadorCarrinho: GerenciadorCarrinho;

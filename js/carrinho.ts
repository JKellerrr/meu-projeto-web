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
const produtos: Record<string, Produto> = {
  produto1: {
    nome: 'Torresmo ao molho conhaque',
    preco: 50.0,
  },
  produto2: {
    nome: 'Mondongo ao molho branco',
    preco: 45.0,
  },
  produto3: {
    nome: 'Rollmops',
    preco: 35.0,
  },
};

/**
 * Classe para gerenciar o carrinho de compras
 */
class GerenciadorCarrinho {
  private readonly STORAGE_KEY = 'carrinho';
  private readonly CONTAINER_ID = 'carrinho-content';

  /**
   * Carrega o carrinho do localStorage
   */
  private carregarCarrinho(): CarrinhoRecord {
    const carrinhoJSON = localStorage.getItem(this.STORAGE_KEY);
    return carrinhoJSON ? JSON.parse(carrinhoJSON) : {};
  }

  /**
   * Salva o carrinho no localStorage
   */
  private salvarCarrinho(carrinho: CarrinhoRecord): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(carrinho));
  }

  /**
   * Remove um item do carrinho
   */
  public removerDoCarrinho(produtoId: string): void {
    const carrinho = this.carregarCarrinho();
    delete carrinho[produtoId];
    this.salvarCarrinho(carrinho);
    this.exibir();
  }

  /**
   * Atualiza a quantidade de um produto no carrinho
   */
  public atualizarQuantidade(produtoId: string, novaQuantidade: number): void {
    if (novaQuantidade < 1) {
      this.removerDoCarrinho(produtoId);
      return;
    }

    const carrinho = this.carregarCarrinho();
    if (carrinho[produtoId]) {
      carrinho[produtoId].quantidade = novaQuantidade;
      this.salvarCarrinho(carrinho);
      this.exibir();
    }
  }

  /**
   * Calcula o total do carrinho
   */
  private calcularTotal(carrinho: CarrinhoRecord): number {
    return Object.entries(carrinho).reduce((total, [produtoId, item]) => {
      const produto = produtos[produtoId];
      return produto ? total + produto.preco * item.quantidade : total;
    }, 0);
  }

  /**
   * Formata número para moeda brasileira
   */
  private formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  /**
   * Exibe o carrinho na página
   */
  public exibir(): void {
    const carrinho = this.carregarCarrinho();
    const container = document.getElementById(this.CONTAINER_ID);

    if (!container) return;

    // Carrinho vazio
    if (Object.keys(carrinho).length === 0) {
      container.innerHTML = `
        <div class="alert alert-info" role="alert">
          <h5>Seu carrinho está vazio!</h5>
          <p>Volte para a página de <a href="produtos.html" class="alert-link">produtos</a> e adicione itens ao seu carrinho.</p>
        </div>
      `;
      return;
    }

    // Constrói a tabela com os itens
    const linhasTabela = Object.entries(carrinho)
      .filter(([produtoId]) => produtos[produtoId])
      .map(([produtoId, item]) => this.criarLinhaTabela(produtoId, item))
      .join('');

    const total = this.calcularTotal(carrinho);
    const totalFormatado = this.formatarMoeda(total);

    container.innerHTML = `
      <div class="table-responsive table-carrinho">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Preço Unitário</th>
              <th>Quantidade</th>
              <th>Subtotal</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            ${linhasTabela}
          </tbody>
        </table>
      </div>

      <div class="resumo-carrinho">
        <div class="row">
          <div class="col-md-8">
            <h4>Resumo da Compra</h4>
          </div>
          <div class="col-md-4 text-end">
            <p class="mb-2"><strong>Total:</strong> <span class="total-final">${totalFormatado}</span></p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Cria uma linha da tabela para um item do carrinho
   */
  private criarLinhaTabela(produtoId: string, item: ItemCarrinho): string {
    const produto = produtos[produtoId];
    if (!produto) return '';

    const subtotal = produto.preco * item.quantidade;
    const precoFormatado = this.formatarMoeda(produto.preco);
    const subtotalFormatado = this.formatarMoeda(subtotal);

    return `
      <tr>
        <td>${produto.nome}</td>
        <td class="preco">${precoFormatado}</td>
        <td>
          <input 
            type="number" 
            class="form-control" 
            style="width: 80px;" 
            value="${item.quantidade}" 
            min="1" 
            max="100"
            onchange="gerenciadorCarrinho.atualizarQuantidade('${produtoId}', parseInt(this.value))">
        </td>
        <td class="preco">${subtotalFormatado}</td>
        <td>
          <button 
            class="btn btn-danger btn-remover" 
            onclick="gerenciadorCarrinho.removerDoCarrinho('${produtoId}')">
            Remover
          </button>
        </td>
      </tr>
    `;
  }
}

/**
 * Instância global do gerenciador de carrinho
 */
const gerenciadorCarrinho = new GerenciadorCarrinho();

// Exibe o carrinho quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  gerenciadorCarrinho.exibir();
});

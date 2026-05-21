'use strict';
var Tema;
(function (Tema) {
  Tema['LIGHT'] = 'light';
  Tema['DARK'] = 'dark';
})(Tema || (Tema = {}));
/**
 * Classe para gerenciar temas
 */
class GerenciadorTema {
  constructor() {
    this.STORAGE_KEY = 'theme';
    this.BTN_ID = 'theme-toggle';
  }
  /**
   * Aplica o tema salvo ou padrão
   */
  aplicarTema(tema) {
    const temaSalvo = localStorage.getItem(this.STORAGE_KEY);
    const temaAtual = tema ?? temaSalvo ?? Tema.LIGHT;
    const temaFinal = temaAtual === Tema.DARK ? Tema.DARK : Tema.LIGHT;
    document.documentElement.dataset.theme = temaFinal;
    localStorage.setItem(this.STORAGE_KEY, temaFinal);
    this.atualizarBotao(temaFinal);
  }
  /**
   * Alterna entre temas claro e escuro
   */
  alternarTema() {
    const temaAtual =
      document.documentElement.dataset.theme ??
      localStorage.getItem(this.STORAGE_KEY) ??
      Tema.LIGHT;
    const proximoTema = temaAtual === Tema.DARK ? Tema.LIGHT : Tema.DARK;
    this.aplicarTema(proximoTema);
  }
  /**
   * Atualiza o texto e estilo do botão de tema
   */
  atualizarBotao(tema) {
    const botao = document.getElementById(this.BTN_ID);
    if (!botao) return;
    const [icone, titulo, removerClasse, adicionarClasse] =
      tema === Tema.DARK
        ? [
            '☀️',
            'Ativar modo claro',
            'btn-outline-secondary',
            'btn-outline-light',
          ]
        : [
            '🌙',
            'Ativar modo escuro',
            'btn-outline-light',
            'btn-outline-secondary',
          ];
    botao.textContent = icone;
    botao.title = titulo;
    botao.classList.remove(removerClasse);
    botao.classList.add(adicionarClasse);
  }
}
/**
 * Classe para gerenciar cálculos de total
 */
class CalculadoraTotal {
  /**
   * Calcula o total baseado nos checkboxes marcados
   */
  calcularTotal() {
    const checkboxes = Array.from(document.querySelectorAll('.item-produto'));
    const total = checkboxes
      .filter((checkbox) => checkbox.checked)
      .reduce((acc, checkbox) => {
        const preco = parseFloat(checkbox.value);
        const qtdInputId = checkbox.id.replace('produto', 'qtd');
        const qtdInput = document.getElementById(qtdInputId);
        const quantidade = parseInt(qtdInput?.value ?? '1') || 1;
        return acc + preco * quantidade;
      }, 0);
    const valorTotalElement = document.getElementById('valor-total');
    if (valorTotalElement) {
      valorTotalElement.textContent = this.formatarMoeda(total);
    }
  }
  /**
   * Formata número para moeda brasileira
   */
  formatarMoeda(valor) {
    return valor
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
      .replace('R$', '')
      .trim();
  }
}
/**
 * Classe para carregar e exibir depoimentos
 */
class CarregadorDepoimentos {
  constructor() {
    this.API_URL = 'https://jsonplaceholder.typicode.com/comments';
    this.CONTAINER_ID = 'lista-depoimentos';
  }
  /**
   * Carrega depoimentos da API de forma assíncrona
   */
  async carregar() {
    console.log('🔄 Iniciando carregamento de depoimentos...');
    try {
      const response = await fetch(`${this.API_URL}?_limit=3`);
      console.log('📡 Resposta recebida:', response.status);
      if (!response.ok) {
        throw new Error(`Erro ao carregar depoimentos: ${response.status}`);
      }
      const depoimentos = await response.json();
      console.log('✅ Dados recebidos:', depoimentos);
      this.renderizar(depoimentos);
    } catch (erro) {
      console.error('❌ Erro ao carregar depoimentos:', erro);
      this.exibirErro();
    }
  }
  /**
   * Renderiza os depoimentos no container
   */
  renderizar(depoimentos) {
    const container = document.getElementById(this.CONTAINER_ID);
    if (!container) {
      console.error(
        `❌ Elemento com ID "${this.CONTAINER_ID}" não encontrado!`
      );
      return;
    }
    container.innerHTML = '';
    const cardsHTML = depoimentos
      .map((depoimento, index) => {
        console.log(
          `📝 Renderizando depoimento ${index + 1}:`,
          depoimento.name
        );
        return this.criarCardDepoimento(depoimento);
      })
      .join('');
    container.innerHTML = cardsHTML;
    console.log(
      `✅ ${depoimentos.length} depoimentos renderizados com sucesso!`
    );
  }
  /**
   * Cria HTML de um card de depoimento
   */
  criarCardDepoimento(depoimento) {
    return `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${depoimento.name}</h5>
            <p class="card-text">${depoimento.body}</p>
            <small class="text-muted">📧 ${depoimento.email}</small>
          </div>
        </div>
      </div>
    `;
  }
  /**
   * Exibe mensagem de erro
   */
  exibirErro() {
    const container = document.getElementById(this.CONTAINER_ID);
    if (container) {
      container.innerHTML =
        '<div class="alert alert-warning">⚠️ Erro ao carregar depoimentos. Verifique a conexão de internet.</div>';
    }
  }
}
/**
 * Classe para gerenciar eventos do DOM
 */
class GerenciadorEventos {
  constructor() {
    this.calculadora = new CalculadoraTotal();
    this.gerenciadorTema = new GerenciadorTema();
    this.carregadorDepoimentos = new CarregadorDepoimentos();
  }
  /**
   * Inicializa todos os event listeners
   */
  inicializar() {
    document.addEventListener('DOMContentLoaded', () => {
      this.configurarCheckboxes();
      this.configurarInputsQuantidade();
      this.configurarTema();
      this.carregarDepoimentos();
    });
  }
  /**
   * Configura listeners para checkboxes de produtos
   */
  configurarCheckboxes() {
    const checkboxes = document.querySelectorAll('.item-produto');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () =>
        this.calculadora.calcularTotal()
      );
    });
  }
  /**
   * Configura listeners para inputs de quantidade
   */
  configurarInputsQuantidade() {
    const inputs = document.querySelectorAll('.qtd-produto');
    inputs.forEach((input) => {
      input.addEventListener('input', () => this.calculadora.calcularTotal());
    });
    this.calculadora.calcularTotal();
  }
  /**
   * Configura listeners para alternância de tema
   */
  configurarTema() {
    const botao = document.getElementById('theme-toggle');
    if (botao) {
      botao.addEventListener('click', () =>
        this.gerenciadorTema.alternarTema()
      );
    }
    this.gerenciadorTema.aplicarTema();
  }
  /**
   * Carrega depoimentos
   */
  async carregarDepoimentos() {
    await this.carregadorDepoimentos.carregar();
  }
}
/**
 * Função para adicionar produto ao carrinho
 */
function adicionarAoCarrinho(produtoId, nomeProduto, preco) {
  const carrinhoJSON = localStorage.getItem('carrinho');
  const carrinho = carrinhoJSON ? JSON.parse(carrinhoJSON) : {};
  const qtdInput = document.getElementById(
    `qtd${produtoId.replace('produto', '')}`
  );
  const quantidade = parseInt(qtdInput?.value ?? '1') || 1;
  if (carrinho[produtoId]) {
    carrinho[produtoId].quantidade += quantidade;
  } else {
    carrinho[produtoId] = {
      nome: nomeProduto,
      preco,
      quantidade,
    };
  }
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  alert(`${nomeProduto} (x${quantidade}) adicionado ao carrinho!`);
}
// Inicializa o gerenciador de eventos quando a página carrega
const gerenciador = new GerenciadorEventos();
gerenciador.inicializar();
//# sourceMappingURL=script.js.map

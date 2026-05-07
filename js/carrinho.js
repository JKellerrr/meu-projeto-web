// Produtos disponíveis
const produtos = {
  produto1: {
    nome: "Torresmo ao molho conhaque",
    preco: 50.0,
  },
  produto2: {
    nome: "Mondongo ao molho branco",
    preco: 45.0,
  },
  produto3: {
    nome: "Rollmops",
    preco: 35.0,
  },
};

// Função para carregar o carrinho
function carregarCarrinho() {
  const carrinhoJSON = localStorage.getItem("carrinho");
  return carrinhoJSON ? JSON.parse(carrinhoJSON) : {};
}

// Função para salvar o carrinho
function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Função para remover item do carrinho
function removerDoCarrinho(produtoId) {
  const carrinho = carregarCarrinho();
  delete carrinho[produtoId];
  salvarCarrinho(carrinho);
  exibirCarrinho();
}

// Função para atualizar quantidade
// eslint-disable-next-line no-unused-vars
function atualizarQuantidade(produtoId, novaQuantidade) {
  if (novaQuantidade < 1) {
    removerDoCarrinho(produtoId);
    return;
  }

  const carrinho = carregarCarrinho();
  if (carrinho[produtoId]) {
    carrinho[produtoId].quantidade = novaQuantidade;
    salvarCarrinho(carrinho);
    exibirCarrinho();
  }
}

// Função para calcular o total
function calcularTotal(carrinho) {
  let total = 0;
  for (const produtoId in carrinho) {
    const item = carrinho[produtoId];
    const produto = produtos[produtoId];
    if (produto) {
      total += produto.preco * item.quantidade;
    }
  }
  return total;
}

// Função para exibir o carrinho
function exibirCarrinho() {
  const carrinho = carregarCarrinho();
  const container = document.getElementById("carrinho-content");

  if (Object.keys(carrinho).length === 0) {
    container.innerHTML = `
            <div class="alert alert-info" role="alert">
                <h5>Seu carrinho está vazio!</h5>
                <p>Volte para a página de <a href="produtos.html" class="alert-link">produtos</a> e adicione itens ao seu carrinho.</p>
            </div>
        `;
    return;
  }

  let html = `
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
    `;

  for (const produtoId in carrinho) {
    const item = carrinho[produtoId];
    const produto = produtos[produtoId];

    if (produto) {
      const subtotal = produto.preco * item.quantidade;
      const precoFormatado = produto.preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      const subtotalFormatado = subtotal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      html += `
                <tr>
                    <td>${produto.nome}</td>
                    <td class="preco">${precoFormatado}</td>
                    <td>
                        <input type="number" class="form-control" style="width: 80px;" 
                            value="${item.quantidade}" min="1" max="100"
                            onchange="atualizarQuantidade('${produtoId}', parseInt(this.value))">
                    </td>
                    <td class="preco">${subtotalFormatado}</td>
                    <td>
                        <button class="btn btn-danger btn-remover" onclick="removerDoCarrinho('${produtoId}')">
                            Remover
                        </button>
                    </td>
                </tr>
            `;
    }
  }

  const total = calcularTotal(carrinho);
  const totalFormatado = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  html += `
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

        <div class="row mt-4">
            <div class="col-md-6">
                <a href="produtos.html" class="btn btn-secondary btn-lg w-100">
                    ← Continuar Comprando
                </a>
            </div>
            <div class="col-md-6">
                <button class="btn btn-success btn-lg w-100" onclick="efetivarCompra()">
                    ✓ Efetivar Compra
                </button>
            </div>
        </div>
    `;

  container.innerHTML = html;
}

// Função para efetivar a compra
// eslint-disable-next-line no-unused-vars
function efetivarCompra() {
  const carrinho = carregarCarrinho();

  if (Object.keys(carrinho).length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const total = calcularTotal(carrinho);
  const totalFormatado = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  let resumo = "RESUMO DA COMPRA\n\n";
  resumo += "===================\n";

  for (const produtoId in carrinho) {
    const item = carrinho[produtoId];
    const produto = produtos[produtoId];

    if (produto) {
      const subtotal = (produto.preco * item.quantidade).toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL",
        },
      );
      resumo += `${produto.nome}\n`;
      resumo += `Quantidade: ${item.quantidade}\n`;
      resumo += `Subtotal: ${subtotal}\n\n`;
    }
  }

  resumo += "===================\n";
  resumo += `TOTAL: ${totalFormatado}\n`;
  resumo += "===================\n\n";
  resumo += "Compra efetuada com sucesso!\n";
  resumo += "Obrigado por sua compra!";

  alert(resumo);

  // Limpar o carrinho após a compra
  localStorage.removeItem("carrinho");

  // Redirecionar para página de produtos
  setTimeout(() => {
    window.location.href = "produtos.html";
  }, 500);
}

// Carregar e exibir o carrinho ao abrir a página
document.addEventListener("DOMContentLoaded", function () {
  exibirCarrinho();
});

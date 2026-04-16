// Função para gerenciar o carrinho de compras
function adicionarAoCarrinho(produtoId, nomeProduto, preco) {
    const carrinhoJSON = localStorage.getItem('carrinho');
    let carrinho = carrinhoJSON ? JSON.parse(carrinhoJSON) : {};
    
    const qtdInput = document.getElementById('qtd' + produtoId.replace('produto', ''));
    const quantidade = parseInt(qtdInput.value) || 1;
    
    if (carrinho[produtoId]) {
        carrinho[produtoId].quantidade += quantidade;
    } else {
        carrinho[produtoId] = {
            nome: nomeProduto,
            preco: preco,
            quantidade: quantidade
        };
    }
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    alert(`${nomeProduto} (x${quantidade}) adicionado ao carrinho!`);
}

function calcularTotal() {
    // Seleciona todos os checkboxes dos produtos
    const checkboxes = document.querySelectorAll('.item-produto');
    
    // Inicia a variável total em 0
    let total = 0;
    
    // Laço de repetição para percorrer cada checkbox
    checkboxes.forEach((checkbox) => {
        // Se o checkbox estiver marcado
        if (checkbox.checked) {
            // Obtém o preço do atributo value do checkbox
            const preco = parseFloat(checkbox.value);
            
            // Obtém o ID do checkbox para encontrar o input de quantidade correspondente
            const checkboxId = checkbox.id; // ex: 'produto1'
            const qtdInputId = checkboxId.replace('produto', 'qtd'); // ex: 'qtd1'
            
            // Seleciona o input de quantidade correspondente
            const qtdInput = document.getElementById(qtdInputId);
            
            // Obtém a quantidade
            const quantidade = parseInt(qtdInput.value) || 1;
            
            // Multiplica preço pela quantidade e soma ao total
            total += preco * quantidade;
        }
    });
    
    // Seleciona o elemento onde o total será exibido
    const valorTotalElement = document.getElementById('valor-total');
    
    // Atualiza o texto com o valor calculado formatado para moeda brasileira (se o elemento existir)
    if (valorTotalElement) {
        valorTotalElement.textContent = total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).replace('R$', '').trim();
    }
}

function atualizarBotaoTema(tema) {
    const botao = document.getElementById('theme-toggle');
    if (!botao) {
        return;
    }

    if (tema === 'dark') {
        botao.textContent = '☀️';
        botao.title = 'Ativar modo claro';
        botao.classList.remove('btn-outline-secondary');
        botao.classList.add('btn-outline-light');
    } else {
        botao.textContent = '🌙';
        botao.title = 'Ativar modo escuro';
        botao.classList.remove('btn-outline-light');
        botao.classList.add('btn-outline-secondary');
    }
}

function aplicarTema(tema) {
    const temaSalvo = localStorage.getItem('theme');
    const temaAtual = tema || temaSalvo || 'light';
    const temaFinal = temaAtual === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = temaFinal;
    localStorage.setItem('theme', temaFinal);
    atualizarBotaoTema(temaFinal);
}

function alternarTema() {
    const temaAtual = document.documentElement.dataset.theme || localStorage.getItem('theme') || 'light';
    const proximoTema = temaAtual === 'dark' ? 'light' : 'dark';
    aplicarTema(proximoTema);
}

// Função assíncrona para carregar depoimentos da API
async function carregarDepoimentos() {
    console.log('🔄 Iniciando carregamento de depoimentos...');
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=3');
        
        console.log('📡 Resposta recebida:', response.status);
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar depoimentos: ${response.status}`);
        }
        
        const depoimentos = await response.json();
        console.log('✅ Dados recebidos:', depoimentos);
        
        const listaDepoimentos = document.getElementById('lista-depoimentos');
        console.log('📍 Elemento encontrado:', listaDepoimentos);
        
        if (listaDepoimentos) {
            listaDepoimentos.innerHTML = '';
            
            // Laço de repetição para cada depoimento
            depoimentos.forEach((depoimento, index) => {
                console.log(`📝 Renderizando depoimento ${index + 1}:`, depoimento.name);
                const card = `
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
                listaDepoimentos.innerHTML += card;
            });
            
            console.log(`✅ ${depoimentos.length} depoimentos renderizados com sucesso!`);
        } else {
            console.error('❌ Elemento com ID "lista-depoimentos" não encontrado!');
        }
        
    } catch (erro) {
        console.error('❌ Erro ao carregar depoimentos:', erro);
        const listaDepoimentos = document.getElementById('lista-depoimentos');
        if (listaDepoimentos) {
            listaDepoimentos.innerHTML = '<div class="alert alert-warning">⚠️ Erro ao carregar depoimentos. Verifique a conexão de internet.</div>';
        }
    }
}

// Adiciona listeners aos checkboxes e inputs para recalcular quando mudarem
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.item-produto');
    const qtdInputs = document.querySelectorAll('.qtd-produto');
    
    // Listener para os checkboxes
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', calcularTotal);
    });
    
    // Listener para os inputs de quantidade
    qtdInputs.forEach((input) => {
        input.addEventListener('input', calcularTotal);
    });
    
    // Calcula o total inicial
    calcularTotal();

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', alternarTema);
    }

    // Aplica o tema salvo ou padrão
    aplicarTema();
    
    // Carrega os depoimentos quando a página carrega
    carregarDepoimentos();
});

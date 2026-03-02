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
    
    // Atualiza o texto com o valor calculado formatado para moeda brasileira
    valorTotalElement.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).replace('R$', '').trim();
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
});

eventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.item-produto');
    const qtdInputs = document.querySelectorAll('.qtd-produto');    
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', calcularTotal);
    });
    qtdInputs.forEach((input) => {
        input.addEventListener('input', calcularTotal);
    }); 
    calcularTotal();
});

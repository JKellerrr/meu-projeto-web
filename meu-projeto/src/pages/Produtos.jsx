import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const produtosData = [
  {
    id: 'produto1',
    nome: 'Torresmo ao molho conhaque',
    descricao: 'Torresmos sequinhos e delicionos embebedados em molho de conhaque.',
    preco: 50.00,
    imagem: 'https://receitatodahora.com.br/wp-content/uploads/2024/10/torresmo-crocante-1510-1024x683.jpg.webp'
  },
  {
    id: 'produto2',
    nome: 'Mondongo ao molho branco',
    descricao: 'Mondongo ao molho branco com tempero especial.',
    preco: 45.00,
    imagem: 'https://temperododia.com.br/wp-content/uploads/2025/06/receita-mondongo-dobradinha-1024x683.jpg'
  },
  {
    id: 'produto3',
    nome: 'Rollmops',
    descricao: 'Rollmops tradicionais com tempero especial.',
    preco: 35.00,
    imagem: 'https://heikograbolle.wordpress.com/wp-content/uploads/2012/03/rollmops.jpg?w=768&h=576'
  }
];

const Produtos = () => {
  const { addToCart } = useContext(CartContext);
  const [quantidades, setQuantidades] = useState({
    produto1: 1,
    produto2: 1,
    produto3: 1
  });
  const [selecionados, setSelecionados] = useState({
    produto1: false,
    produto2: false,
    produto3: false
  });

  const handleQuantidadeChange = (id, valor) => {
    setQuantidades(prev => ({ ...prev, [id]: parseInt(valor) || 1 }));
  };

  const handleCheckboxChange = (id) => {
    setSelecionados(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calcularTotal = () => {
    let total = 0;
    produtosData.forEach(produto => {
      if (selecionados[produto.id]) {
        total += produto.preco * (quantidades[produto.id] || 1);
      }
    });
    return total;
  };

  return (
    <div className="container-fluid px-2">
      <div className="row g-2 mt-2">
        {produtosData.map(produto => (
          <div className="col-lg-4 col-md-6 col-sm-12" key={produto.id}>
            <div className="card">
              <img src={produto.imagem} className="card-img-top" alt={produto.nome} />
              <div className="card-body p-2">
                <h5 className="card-title">{produto.nome}</h5>
                <p className="card-text">{produto.descricao}</p>
                <div className="mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input item-produto"
                    checked={selecionados[produto.id]}
                    onChange={() => handleCheckboxChange(produto.id)}
                    id={produto.id}
                  />
                  <label className="form-check-label ms-1" htmlFor={produto.id}>Adicionar ao orçamento</label>
                </div>
                <div className="mb-2">
                  <label htmlFor={`qtd-${produto.id}`} className="form-label">Quantidade:</label>
                  <input
                    type="number"
                    className="form-control qtd-produto"
                    id={`qtd-${produto.id}`}
                    value={quantidades[produto.id]}
                    onChange={(e) => handleQuantidadeChange(produto.id, e.target.value)}
                    min="1"
                  />
                </div>
                <button
                  className="btn btn-outline-light"
                  onClick={() => addToCart(produto.id, produto.nome, produto.preco, quantidades[produto.id])}
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="alert alert-info text-center mt-4" role="alert">
        <h3 className="mb-0">
          Valor Total do Orçamento: R$ <span>{calcularTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
        </h3>
      </div>

      <div className="text-center mt-4">
        <Link to="/carrinho" className="btn btn-success btn-lg">🛒 Ir para o Carrinho</Link>
      </div>
    </div>
  );
};

export default Produtos;

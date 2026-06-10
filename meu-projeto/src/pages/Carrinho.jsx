import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const Carrinho = () => {
  const { cart, removeFromCart, updateQuantity, calculateTotal } = useContext(CartContext);

  const cartItems = Object.entries(cart);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Carrinho de Compras</h2>

      {cartItems.length === 0 ? (
        <div className="alert alert-warning text-center">Seu carrinho está vazio.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Preço Unit.</th>
                <th>Quantidade</th>
                <th>Subtotal</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(([id, item]) => (
                <tr key={id}>
                  <td>{item.nome}</td>
                  <td>R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={item.quantidade}
                      min="1"
                      onChange={(e) => updateQuantity(id, parseInt(e.target.value) || 1)}
                      style={{ width: '80px' }}
                    />
                  </td>
                  <td>R$ {(item.preco * item.quantidade).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(id)}>
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end fw-bold">Total:</td>
                <td colSpan="2" className="fw-bold">
                  R$ {calculateTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
          <div className="text-end">
            <button className="btn btn-success">Finalizar Compra</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrinho;

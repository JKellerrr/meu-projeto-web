import React, { useState, useEffect } from 'react';

const Home = () => {
  const [depoimentos, setDepoimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarDepoimentos = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=3');
        if (!response.ok) {
          throw new Error(`Erro ao carregar depoimentos: ${response.status}`);
        }
        const data = await response.json();
        setDepoimentos(data);
      } catch (err) {
        console.error('Erro ao carregar depoimentos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    carregarDepoimentos();
  }, []);

  return (
    <div className="container mt-5">
      <h2>O que nossos clientes dizem!</h2>
      <div className="row" id="lista-depoimentos">
        {loading && <p>Carregando depoimentos...</p>}
        {error && (
          <div className="alert alert-warning">
            ⚠️ Erro ao carregar depoimentos. Verifique a conexão de internet.
          </div>
        )}
        {!loading && !error && depoimentos.map((depoimento) => (
          <div className="col-md-4 mb-3" key={depoimento.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{depoimento.name}</h5>
                <p className="card-text">{depoimento.body}</p>
                <small className="text-muted">📧 {depoimento.email}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

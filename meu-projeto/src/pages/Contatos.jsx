import React, { useState } from 'react';

const Contatos = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: '',
    lembrar: false
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso!');
    // Reset form se desejar
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">Nome</label>
          <input 
            type="text" 
            className="form-control" 
            id="nome" 
            value={formData.nome}
            onChange={handleChange}
            required
            aria-describedby="nomeHelp" 
          />
          <div id="nomeHelp" className="form-text">Informe o seu Nome.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="mensagem" className="form-label">Área de texto</label>
          <textarea 
            className="form-control" 
            id="mensagem" 
            rows="3"
            value={formData.mensagem}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3 form-check">
          <input 
            type="checkbox" 
            className="form-check-input" 
            id="lembrar" 
            checked={formData.lembrar}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="lembrar">Lembre-se de mim</label>
        </div>
        <button type="submit" className="btn btn-success">Enviar</button>
      </form>
    </div>
  );
};

export default Contatos;

import React, { useState } from 'react';
import CustomDatePicker from './DatePicker';

const LembreteForm: React.FC = () => {
  const [texto, setTexto] = useState('');
  const [data, setData] = useState('');
  const [prioridade, setPrioridade] = useState(0);
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/lembretes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texto,
          data,
          prioridade,
          categoriaId: categoria || null,
          descricao
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar lembrete');
      }

      // Limpa o formulário após criar com sucesso
      setTexto('');
      setData('');
      setPrioridade(0);
      setCategoria('');
      setDescricao('');
    } catch (err) {
      console.error('Erro ao criar lembrete:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar lembrete');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="texto" className="block text-sm font-medium text-gray-700">
          Lembrete
        </label>
        <input
          type="text"
          id="texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="data" className="block text-sm font-medium text-gray-700">
          Data
        </label>
        <CustomDatePicker
          value={data}
          onChange={setData}
          className="mt-1"
        />
      </div>
      {error && (
        <div className="text-red-600 text-sm mt-1">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Salvando...' : 'Adicionar Lembrete'}
      </button>
    </form>
  );
};

export default LembreteForm; 
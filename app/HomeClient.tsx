'use client'

import { useState, useEffect } from "react";

interface Lembrete {
  id: number;
  texto: string;
  data: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  error?: string;
  details?: string;
}

const HomeClient = () => {
  const [lembrete, setLembrete] = useState('');
  const [dataInput, setDataInput] = useState('');
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    buscarLembretes();
  }, []);

  const buscarLembretes = async () => {
    try {
      setCarregando(true);
      const response = await fetch('/api/lembretes');
      const data: Lembrete[] | ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiResponse).error || 'Erro ao buscar lembretes');
      }

      setLembretes(data as Lembrete[]);
      setErro('');
    } catch (error) {
      console.error('Erro ao buscar lembretes:', error);
      setErro('Erro ao carregar lembretes. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const salvarLembrete = async () => {
    if (!lembrete || !dataInput) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    try {
      setCarregando(true);
      setErro('');

      const response = await fetch('/api/lembretes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texto: lembrete,
          data: dataInput,
        }),
      });

      const data: Lembrete | ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiResponse).error || 'Erro ao salvar lembrete');
      }

      setLembrete('');
      setDataInput('');
      await buscarLembretes();
    } catch (error) {
      console.error('Erro ao salvar lembrete:', error);
      setErro('Erro ao salvar lembrete. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-[5rem] bg-blue-400 gap-2 py-4">
        <div className="flex flex-row items-start justify-center gap-4">
          <input
            type="text"
            placeholder="Lembrete"
            className="border border-blue-500 bg-blue-300 w-[40%] rounded-lg p-2 text-blue-900 outline-none focus:border-blue-900"
            value={lembrete}
            onChange={(e) => setLembrete(e.target.value)}
          />
          <input
            type="date"
            className="border border-blue-500 bg-blue-300 w-[30%] rounded-lg p-2 text-blue-900 outline-none focus:border-blue-900"
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
          />
          <button
            className="border border-blue-900 bg-blue-900 text-white rounded-lg p-2 cursor-pointer hover:bg-blue-800 transition-colors disabled:opacity-50"
            onClick={salvarLembrete}
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
        {erro && (
          <p className="text-red-700 text-sm">{erro}</p>
        )}
      </div>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] bg-blue-300 gap-4 pt-4">
        {carregando && lembretes.length === 0 ? (
          <p className="text-blue-900">Carregando lembretes...</p>
        ) : lembretes.length === 0 ? (
          <p className="text-blue-900">Nenhum lembrete cadastrado</p>
        ) : (
          lembretes.map((item) => (
            <div key={item.id} className="flex flex-row items-center justify-between w-[80%] h-[4rem] bg-blue-400 gap-4 p-4 rounded-lg shadow-md">
              <p className="text-blue-900 font-medium">{item.texto}</p>
              <p className="text-blue-900">{formatarData(item.data)}</p>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default HomeClient;
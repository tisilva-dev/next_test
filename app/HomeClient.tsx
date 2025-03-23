'use client'

import { useState, useEffect } from "react";

/**
 * Interface que define a estrutura de um lembrete
 * 
 * Em TypeScript, interfaces são usadas para definir a forma dos objetos
 * Isso ajuda na verificação de tipos e autocompletar do editor
 * 
 * Campos:
 * - id: número único gerado automaticamente pelo banco
 * - texto: conteúdo do lembrete
 * - data: data do lembrete no formato ISO (YYYY-MM-DD)
 * - createdAt: timestamp de criação do registro
 * - updatedAt: timestamp da última atualização
 */
interface Lembrete {
  id: number;          // ID único do lembrete
  texto: string;       // Texto do lembrete
  data: string;        // Data do lembrete no formato ISO
  createdAt: string;   // Data de criação do registro
  updatedAt: string;   // Data da última atualização
}

/**
 * Interface para respostas de erro da API
 * 
 * Usada para tipar as respostas de erro da API
 * O operador ? indica que o campo é opcional
 * 
 * Campos:
 * - error: mensagem principal do erro
 * - details: detalhes adicionais do erro (opcional)
 */
interface ApiResponse {
  error?: string;      // Mensagem de erro
  details?: string;    // Detalhes adicionais do erro
}

/**
 * Componente principal da aplicação
 * 
 * O 'use client' no topo do arquivo indica que este é um componente
 * que será executado no lado do cliente (navegador)
 * 
 * Este componente implementa um CRUD completo de lembretes:
 * - Create: criação de novos lembretes
 * - Read: listagem de lembretes existentes
 * - Update: edição de lembretes
 * - Delete: remoção de lembretes
 * 
 * Funcionalidades:
 * - Validação de data em tempo real
 * - Formatação automática de datas
 * - Feedback visual de erros
 * - Estados de carregamento
 * - Confirmação de ações
 */
const HomeClient = () => {
  // Estados para gerenciar o formulário de criação
  const [lembrete, setLembrete] = useState('');           // Texto do novo lembrete
  const [dataInput, setDataInput] = useState('');         // Data do novo lembrete
  const [dataValida, setDataValida] = useState(false);    // Validação da data

  // Estados para gerenciar a lista de lembretes
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);  // Lista de lembretes

  // Estados para gerenciar a edição
  const [editandoId, setEditandoId] = useState<number | null>(null);  // ID do lembrete sendo editado
  const [lembreteEditando, setLembreteEditando] = useState('');       // Texto do lembrete sendo editado
  const [dataEditando, setDataEditando] = useState('');               // Data do lembrete sendo editado
  const [dataEditandoValida, setDataEditandoValida] = useState(false); // Validação da data em edição

  // Estados para gerenciar a interface
  const [erro, setErro] = useState('');                  // Mensagens de erro
  const [carregando, setCarregando] = useState(false);   // Estado de carregamento
  const [deletandoId, setDeletandoId] = useState<number | null>(null); // ID do lembrete sendo deletado

  /**
   * useEffect é um hook do React que executa efeitos colaterais
   * O array vazio [] significa que o efeito só é executado uma vez,
   * quando o componente é montado
   * 
   * Neste caso, carrega a lista inicial de lembretes
   */
  useEffect(() => {
    buscarLembretes();
  }, []);

  /**
   * Formata a entrada de data para o formato dd/mm/aaaa
   * 
   * Esta função:
   * 1. Remove caracteres não numéricos
   * 2. Limita a 8 dígitos
   * 3. Adiciona as barras automaticamente
   * 
   * Exemplo:
   * - Entrada: "12345678"
   * - Saída: "12/34/5678"
   * 
   * @param value - Valor digitado pelo usuário
   * @returns Data formatada
   */
  const formatarDataInput = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numeros = value.replace(/\D/g, '');

    // Limita a 8 dígitos (ddmmaaaa)
    const numerosLimitados = numeros.slice(0, 8);

    // Formata a data
    let dataFormatada = '';
    if (numerosLimitados.length > 0) {
      dataFormatada = numerosLimitados;
      if (numerosLimitados.length > 2) {
        dataFormatada = numerosLimitados.slice(0, 2) + '/' + numerosLimitados.slice(2);
      }
      if (numerosLimitados.length > 4) {
        dataFormatada = dataFormatada.slice(0, 5) + '/' + dataFormatada.slice(5);
      }
    }

    return dataFormatada;
  };

  /**
   * Valida se uma data é válida
   * 
   * Verifica:
   * 1. Se todos os valores são números válidos
   * 2. Se o mês está entre 1 e 12
   * 3. Se o dia está dentro do limite do mês
   * 4. Se o ano está em um intervalo razoável
   * 
   * Exemplo:
   * - "31/02/2024" -> false (fevereiro não tem 31 dias)
   * - "29/02/2024" -> true (2024 é bissexto)
   * - "29/02/2023" -> false (2023 não é bissexto)
   * 
   * @param data - Data no formato dd/mm/aaaa
   * @returns true se a data for válida, false caso contrário
   */
  const validarData = (data: string) => {
    const [dia, mes, ano] = data.split('/').map(Number);

    // Verifica se todos os valores são números válidos
    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return false;

    // Verifica se o mês está entre 1 e 12
    if (mes < 1 || mes > 12) return false;

    // Verifica se o dia está dentro do limite do mês
    const diasNoMes = new Date(ano, mes, 0).getDate();
    if (dia < 1 || dia > diasNoMes) return false;

    // Verifica se o ano está em um intervalo razoável
    const anoAtual = new Date().getFullYear();
    if (ano < 1980 || ano > anoAtual + 10) return false;

    return true;
  };

  /**
   * Manipula a mudança no campo de data do formulário de criação
   * 
   * Esta função é chamada toda vez que o usuário digita no campo de data
   * Ela formata a entrada e valida a data em tempo real
   * 
   * O fluxo é:
   * 1. Formata o valor digitado
   * 2. Atualiza o estado com o valor formatado
   * 3. Se a data estiver completa (10 caracteres), valida
   * 4. Atualiza o estado de validação e mensagens de erro
   */
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarDataInput(e.target.value);
    setDataInput(valorFormatado);

    // Valida a data em tempo real
    if (valorFormatado.length === 10) {
      const ehValida = validarData(valorFormatado);
      setDataValida(ehValida);
      setErro(ehValida ? '' : 'Data inválida. Use o formato dd/mm/aaaa');
    } else {
      setDataValida(false);
      setErro('');
    }
  };

  /**
   * Busca todos os lembretes do servidor
   * 
   * Esta função é chamada:
   * 1. Quando o componente é montado
   * 2. Após criar um novo lembrete
   * 3. Após deletar um lembrete
  4. Após atualizar um lembrete
   * 
   * O fluxo é:
   * 1. Ativa o estado de carregamento
   * 2. Faz a requisição para a API
   * 3. Processa a resposta
   * 4. Atualiza o estado com os lembretes
   * 5. Trata possíveis erros
   */
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

  /**
   * Salva um novo lembrete
   * 
   * Esta função:
   * 1. Valida os campos
   * 2. Converte a data para o formato ISO
   * 3. Envia os dados para a API
   * 4. Atualiza a lista de lembretes
   * 
   * O fluxo é:
   * 1. Valida se os campos estão preenchidos
   * 2. Valida se a data é válida
   * 3. Converte a data para ISO
   * 4. Faz a requisição POST
   * 5. Processa a resposta
   * 6. Limpa o formulário
   * 7. Atualiza a lista
   */
  const salvarLembrete = async () => {
    if (!lembrete || !dataInput) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    if (!dataValida) {
      setErro('Data inválida. Use o formato dd/mm/aaaa');
      return;
    }

    try {
      setCarregando(true);
      setErro('');

      // Converte a data do formato brasileiro para ISO
      const [dia, mes, ano] = dataInput.split('/').map(Number);
      const dataISO = new Date(ano, mes - 1, dia).toISOString().split('T')[0];

      const response = await fetch('/api/lembretes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texto: lembrete,
          data: dataISO,
        }),
      });

      const data: Lembrete | ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiResponse).error || 'Erro ao salvar lembrete');
      }

      setLembrete('');
      setDataInput('');
      setDataValida(false);
      await buscarLembretes();
    } catch (error) {
      console.error('Erro ao salvar lembrete:', error);
      setErro('Erro ao salvar lembrete. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  /**
   * Deleta um lembrete
   * 
   * Esta função:
   * 1. Marca o lembrete como sendo deletado
   * 2. Faz a requisição DELETE
   * 3. Atualiza a lista após sucesso
   * 
   * @param id - ID do lembrete a ser deletado
   */
  const deletarLembrete = async (id: number) => {
    try {
      setDeletandoId(id);
      setErro('');

      const response = await fetch(`/api/lembretes?id=${id}`, {
        method: 'DELETE',
      });

      const data: Lembrete | ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiResponse).error || 'Erro ao deletar lembrete');
      }

      await buscarLembretes();
    } catch (error) {
      console.error('Erro ao deletar lembrete:', error);
      setErro('Erro ao deletar lembrete. Tente novamente.');
    } finally {
      setDeletandoId(null);
    }
  };

  /**
   * Formata uma data ISO para o formato brasileiro
   * 
   * Esta função é usada para exibir as datas na interface
   * 
   * Exemplo:
   * - Entrada: "2024-03-15"
   * - Saída: "15/03/2024"
   * 
   * @param dataString - Data no formato ISO
   * @returns Data formatada no padrão brasileiro
   */
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  /**
   * Inicia o modo de edição de um lembrete
   * 
   * Esta função:
   * 1. Define qual lembrete está sendo editado
   * 2. Preenche os campos do formulário com os dados atuais
   * 3. Formata a data para exibição
   * 
   * @param item - Lembrete a ser editado
   */
  const iniciarEdicao = (item: Lembrete) => {
    setEditandoId(item.id);
    setLembreteEditando(item.texto);
    setDataEditando(formatarData(item.data));
    setDataEditandoValida(true);
  };

  /**
   * Cancela o modo de edição
   * 
   * Esta função:
   * 1. Limpa todos os estados relacionados à edição
   * 2. Remove mensagens de erro
   */
  const cancelarEdicao = () => {
    setEditandoId(null);
    setLembreteEditando('');
    setDataEditando('');
    setDataEditandoValida(false);
    setErro('');
  };

  /**
   * Manipula a mudança no campo de data do formulário de edição
   * 
   * Similar ao handleDataChange, mas para o formulário de edição
   * Mantém a validação em tempo real da data
   */
  const handleDataEditandoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarDataInput(e.target.value);
    setDataEditando(valorFormatado);

    if (valorFormatado.length === 10) {
      const ehValida = validarData(valorFormatado);
      setDataEditandoValida(ehValida);
      setErro(ehValida ? '' : 'Data inválida. Use o formato dd/mm/aaaa');
    } else {
      setDataEditandoValida(false);
      setErro('');
    }
  };

  /**
   * Salva as alterações de um lembrete
   * 
   * Esta função:
   * 1. Valida os campos editados
   * 2. Converte a data para ISO
   * 3. Envia a requisição PUT
   * 4. Atualiza a lista após sucesso
   * 
   * @param id - ID do lembrete a ser atualizado
   */
  const salvarEdicao = async (id: number) => {
    if (!lembreteEditando || !dataEditando) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    if (!dataEditandoValida) {
      setErro('Data inválida. Use o formato dd/mm/aaaa');
      return;
    }

    try {
      setCarregando(true);
      setErro('');

      const [dia, mes, ano] = dataEditando.split('/').map(Number);
      const dataISO = new Date(ano, mes - 1, dia).toISOString().split('T')[0];

      const response = await fetch(`/api/lembretes?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texto: lembreteEditando,
          data: dataISO,
        }),
      });

      const data: Lembrete | ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiResponse).error || 'Erro ao atualizar lembrete');
      }

      setEditandoId(null);
      setLembreteEditando('');
      setDataEditando('');
      setDataEditandoValida(false);
      await buscarLembretes();
    } catch (error) {
      console.error('Erro ao atualizar lembrete:', error);
      setErro('Erro ao atualizar lembrete. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Renderização do componente
  return (
    <>
      {/* Formulário de criação de lembrete */}
      <div className="flex flex-col items-center justify-center h-[5rem] bg-blue-400 gap-2 py-4">
        <div className="flex flex-row items-start justify-center gap-4">
          {/* Campo de texto do lembrete */}
          <input
            type="text"
            placeholder="Lembrete"
            className="border border-blue-500 bg-blue-300 w-[40%] rounded-lg p-2 text-blue-900 outline-none focus:border-blue-900"
            value={lembrete}
            onChange={(e) => setLembrete(e.target.value)}
          />
          {/* Campo de data com validação visual */}
          <input
            type="text"
            placeholder="dd/mm/aaaa"
            className={`border ${dataInput && !dataValida ? 'border-red-500' : 'border-blue-500'} bg-blue-300 w-[30%] rounded-lg p-2 text-blue-900 outline-none focus:border-blue-900`}
            value={dataInput}
            onChange={handleDataChange}
            maxLength={10}
          />
          {/* Botão de salvar com estado de carregamento */}
          <button
            className="border border-blue-900 bg-blue-900 text-white rounded-lg p-2 cursor-pointer hover:bg-blue-800 transition-colors disabled:opacity-50"
            onClick={salvarLembrete}
            disabled={carregando || !lembrete || !dataValida}
          >
            {carregando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
        {/* Mensagem de erro */}
        {erro && (
          <p className="text-red-700 text-sm">{erro}</p>
        )}
      </div>

      {/* Lista de lembretes */}
      <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] bg-blue-300 gap-4 pt-4">
        {/* Estados de carregamento e lista vazia */}
        {carregando && lembretes.length === 0 ? (
          <p className="text-blue-900">Carregando lembretes...</p>
        ) : lembretes.length === 0 ? (
          <p className="text-blue-900">Nenhum lembrete cadastrado</p>
        ) : (
          // Lista de lembretes
          lembretes.map((item) => (
            <div key={item.id} className="flex flex-row items-center justify-between w-[80%] h-[4rem] bg-blue-400 gap-4 p-4 rounded-lg shadow-md">
              {editandoId === item.id ? (
                // Formulário de edição
                <>
                  <div className="flex flex-row items-center gap-4 flex-1">
                    {/* Campo de texto em edição */}
                    <input
                      type="text"
                      value={lembreteEditando}
                      onChange={(e) => setLembreteEditando(e.target.value)}
                      className="border border-blue-500 bg-blue-300 w-[40%] rounded-lg p-2 text-blue-900 outline-none focus:border-blue-900"
                    />
                    {/* Campo de data em edição */}
                    <input
                      type="text"
                      value={dataEditando}
                      onChange={handleDataEditandoChange}
                      className={`border ${dataEditando && !dataEditandoValida ? 'border-red-500' : 'border-blue-500'} bg-blue-300 w-[30%] rounded-lg p-2 text-blue-900 outline-none focus:border-blue-900`}
                      maxLength={10}
                    />
                  </div>
                  {/* Botões de salvar e cancelar edição */}
                  <div className="flex flex-row gap-2">
                    <button
                      className="border border-green-500 bg-green-500 text-white rounded-lg p-2 cursor-pointer hover:bg-green-600 transition-colors disabled:opacity-50"
                      onClick={() => salvarEdicao(item.id)}
                      disabled={carregando || !lembreteEditando || !dataEditandoValida}
                    >
                      {carregando ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      className="border border-gray-500 bg-gray-500 text-white rounded-lg p-2 cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={cancelarEdicao}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                // Visualização do lembrete
                <>
                  {/* Texto e data do lembrete */}
                  <div className="flex flex-row items-center gap-4">
                    <p className="text-blue-900 font-medium">{item.texto}</p>
                    <p className="text-blue-900">{formatarData(item.data)}</p>
                  </div>
                  {/* Botões de editar e deletar */}
                  <div className="flex flex-row gap-2">
                    <button
                      className="border border-yellow-500 bg-yellow-500 text-white rounded-lg p-2 cursor-pointer hover:bg-yellow-600 transition-colors"
                      onClick={() => iniciarEdicao(item)}
                    >
                      Editar
                    </button>
                    <button
                      className="border border-red-500 bg-red-500 text-white rounded-lg p-2 cursor-pointer hover:bg-red-600 transition-colors disabled:opacity-50"
                      onClick={() => deletarLembrete(item.id)}
                      disabled={deletandoId === item.id}
                    >
                      {deletandoId === item.id ? 'Deletando...' : 'Deletar'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default HomeClient;
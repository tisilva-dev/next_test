'use client'

import { useState, useEffect, useCallback, useMemo } from "react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from "next/image";

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
 * Componente do formulário de criação de lembretes
 * 
 * Props:
 * - onSubmit: função chamada quando o formulário é submetido
 * - carregando: estado que indica se está salvando
 * - erro: mensagem de erro a ser exibida
 */
const LembreteForm = ({ onSubmit, carregando, erro }: {
  onSubmit: (texto: string, data: string) => void;
  carregando: boolean;
  erro: string;
}) => {
  // Estados para controlar o formulário
  const [lembrete, setLembrete] = useState('');           // Texto do lembrete
  const [dataInput, setDataInput] = useState('');         // Data digitada
  const [dataValida, setDataValida] = useState(false);    // Estado de validação da data

  // Função chamada ao clicar em salvar
  const handleSubmit = useCallback(() => {
    onSubmit(lembrete, dataInput);
    setLembrete('');
    setDataInput('');
    setDataValida(false);
  }, [lembrete, dataInput, onSubmit]);

  // Função para formatar e validar a data enquanto digita
  const handleDataChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarDataInput(e.target.value);
    setDataInput(valorFormatado);

    if (valorFormatado.length === 10) {
      const ehValida = validarData(valorFormatado);
      setDataValida(ehValida);
    } else {
      setDataValida(false);
    }
  }, []);

  // Renderização do formulário
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-8 h-8">
          <Image
            src="/images/add-icon.png"
            alt="Adicionar"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-blue-700">Novo Lembrete</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Digite seu lembrete"
            className="input flex-1 text-gray-900 placeholder-gray-500 pl-10"
            value={lembrete}
            onChange={(e) => setLembrete(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Image
              src="/images/note-icon.png"
              alt="Nota"
              width={20}
              height={20}
              className="opacity-50"
            />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="dd/mm/aaaa"
            className={`input w-full md:w-48 text-gray-900 placeholder-gray-500 pl-10 ${dataInput && !dataValida ? 'input-error' : ''
              }`}
            value={dataInput}
            onChange={handleDataChange}
            maxLength={10}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Image
              src="/images/calendar-icon.png"
              alt="Calendário"
              width={20}
              height={20}
              className="opacity-50"
            />
          </div>
        </div>
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={handleSubmit}
          disabled={carregando || !lembrete || !dataValida}
        >
          {carregando ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Salvando...
            </>
          ) : (
            <>
              <Image
                src="/images/save-icon.png"
                alt="Salvar"
                width={20}
                height={20}
                className="brightness-0 invert"
              />
              Salvar
            </>
          )}
        </button>
      </div>
      {erro && (
        <div className="flex items-center gap-2 mt-3 text-red-600">
          <Image
            src="/images/error-icon.png"
            alt="Erro"
            width={20}
            height={20}
          />
          <p className="text-sm font-medium">{erro}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Componente que exibe um lembrete individual
 * 
 * Props:
 * - item: dados do lembrete
 * - onDelete: função chamada ao clicar em deletar
 * - onEdit: função chamada ao clicar em editar
 * - carregando: estado de carregamento
 * - deletandoId: ID do lembrete sendo deletado
 */
const LembreteItem = ({ item, onDelete, onEdit, carregando, deletandoId }: {
  item: Lembrete;
  onDelete: (id: number) => void;
  onEdit: (item: Lembrete) => void;
  carregando: boolean;
  deletandoId: number | null;
}) => {
  // Formata a data para exibição usando date-fns
  const dataFormatada = useMemo(() =>
    format(new Date(item.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
    [item.data]
  );

  // Renderização do item
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 flex items-start gap-4">
          <div className="relative w-8 h-8 mt-1">
            <Image
              src="/images/reminder-icon.png"
              alt="Lembrete"
              fill
              className="object-contain opacity-75"
            />
          </div>
          <div>
            <p className="text-lg font-medium text-blue-800">{item.texto}</p>
            <div className="flex items-center gap-2 mt-1">
              <Image
                src="/images/calendar-icon.png"
                alt="Data"
                width={16}
                height={16}
                className="opacity-50"
              />
              <p className="text-sm text-blue-600">{dataFormatada}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-warning flex items-center gap-2"
            onClick={() => onEdit(item)}
          >
            <Image
              src="/images/edit-icon.png"
              alt="Editar"
              width={16}
              height={16}
              className="brightness-0 invert"
            />
            Editar
          </button>
          <button
            className="btn btn-danger flex items-center gap-2"
            onClick={() => onDelete(item.id)}
            disabled={deletandoId === item.id}
          >
            {deletandoId === item.id ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Deletando...
              </>
            ) : (
              <>
                <Image
                  src="/images/delete-icon.png"
                  alt="Deletar"
                  width={16}
                  height={16}
                  className="brightness-0 invert"
                />
                Deletar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Função para formatar a data enquanto o usuário digita
 * 
 * @param value - Valor digitado pelo usuário
 * @returns Data formatada no padrão dd/mm/aaaa
 */
const formatarDataInput = (value: string) => {
  const numeros = value.replace(/\D/g, '').slice(0, 8);
  let dataFormatada = '';

  if (numeros.length > 0) {
    dataFormatada = numeros;
    if (numeros.length > 2) {
      dataFormatada = numeros.slice(0, 2) + '/' + numeros.slice(2);
    }
    if (numeros.length > 4) {
      dataFormatada = dataFormatada.slice(0, 5) + '/' + dataFormatada.slice(5);
    }
  }

  return dataFormatada;
};

/**
 * Função para validar se uma data é válida
 * 
 * @param data - Data no formato dd/mm/aaaa
 * @returns true se a data for válida, false caso contrário
 */
const validarData = (data: string) => {
  const [dia, mes, ano] = data.split('/').map(Number);
  if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return false;
  if (mes < 1 || mes > 12) return false;

  const diasNoMes = new Date(ano, mes, 0).getDate();
  if (dia < 1 || dia > diasNoMes) return false;

  const anoAtual = new Date().getFullYear();
  if (ano < 1980 || ano > anoAtual + 10) return false;

  return true;
};

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
   * Função para buscar lembretes da API
   * 
   * Esta função:
   * 1. Define o estado de carregamento
   * 2. Faz a requisição GET
   * 3. Atualiza a lista de lembretes
   * 4. Trata erros possíveis
   */
  const buscarLembretes = useCallback(async () => {
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
  }, []);

  // Busca lembretes ao montar o componente
  useEffect(() => {
    buscarLembretes();
  }, [buscarLembretes]);

  /**
   * Função para salvar um novo lembrete
   * 
   * Esta função:
   * 1. Valida os campos
   * 2. Converte a data para ISO
   * 3. Faz a requisição POST
   * 4. Atualiza a lista após sucesso
   */
  const handleSubmit = useCallback(async (texto: string, dataString: string) => {
    if (!texto || !dataString) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    if (!validarData(dataString)) {
      setErro('Data inválida. Use o formato dd/mm/aaaa');
      return;
    }

    try {
      setCarregando(true);
      setErro('');

      const [dia, mes, ano] = dataString.split('/').map(Number);
      const dataISO = new Date(ano, mes - 1, dia).toISOString().split('T')[0];

      const response = await fetch('/api/lembretes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, data: dataISO }),
      });

      const data: Lembrete | ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiResponse).error || 'Erro ao salvar lembrete');
      }

      await buscarLembretes();
    } catch (error) {
      console.error('Erro ao salvar lembrete:', error);
      setErro('Erro ao salvar lembrete. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, [buscarLembretes]);

  /**
   * Função para deletar um lembrete
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
      console.log('Iniciando deleção do lembrete:', id);
      setDeletandoId(id);
      setErro('');

      const response = await fetch(`/api/lembretes?id=${id}`, {
        method: 'DELETE',
      });

      console.log('Resposta da API:', response.status);
      const data: Lembrete | ApiResponse = await response.json();
      console.log('Dados da resposta:', data);

      if (!response.ok) {
        throw new Error((data as ApiResponse).error || 'Erro ao deletar lembrete');
      }

      console.log('Lembrete deletado com sucesso');
      await buscarLembretes();
    } catch (error) {
      console.error('Erro detalhado ao deletar lembrete:', error);
      setErro('Erro ao deletar lembrete. Tente novamente.');
    } finally {
      setDeletandoId(null);
    }
  };

  /**
   * Função para iniciar a edição de um lembrete
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
    setDataEditando(formatarDataInput(item.data));
    setDataEditandoValida(true);
  };

  /**
   * Função para cancelar a edição
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
   * Função para manipular mudanças no campo de data durante a edição
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
   * Função para salvar as alterações de um lembrete
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

  // Renderização do componente principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src="/images/reminder-icon.png"
              alt="Ícone de Lembrete"
              fill
              className="object-contain animate-bounce"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-blue-800 mb-2">
            Gerenciador de Lembretes
          </h1>
          <p className="text-blue-600 text-lg">
            Organize seus compromissos de forma simples e eficiente
          </p>
        </div>

        <div className="space-y-8">
          {/* Formulário de criação de lembretes */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform duration-200">
            <LembreteForm
              onSubmit={handleSubmit}
              carregando={carregando}
              erro={erro}
            />
          </div>

          {/* Lista de lembretes */}
          <div className="space-y-4">
            {carregando && lembretes.length === 0 ? (
              // Estado de carregamento
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                <p className="text-blue-700 mt-6 text-lg font-medium">Carregando lembretes...</p>
              </div>
            ) : lembretes.length === 0 ? (
              // Lista vazia
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <Image
                    src="/images/empty-state.png"
                    alt="Nenhum lembrete"
                    fill
                    className="object-contain opacity-75"
                  />
                </div>
                <p className="text-blue-700 text-xl font-medium mb-2">Nenhum lembrete cadastrado</p>
                <p className="text-gray-600">Comece adicionando seu primeiro lembrete acima!</p>
              </div>
            ) : (
              // Lista de lembretes
              lembretes.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform duration-200">
                  <LembreteItem
                    item={item}
                    onDelete={deletarLembrete}
                    onEdit={iniciarEdicao}
                    carregando={carregando}
                    deletandoId={deletandoId}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeClient;
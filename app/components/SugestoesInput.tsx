/**
 * Componente de input com sugestões de texto
 * 
 * Este componente implementa um campo de texto com
 * sugestões baseadas em IA que aparecem enquanto
 * o usuário digita.
 */

import { useState, useEffect, useRef } from 'react';
import { gerarSugestoes } from '../services/aiService';

interface SugestoesInputProps {
  value: string;
  onChange: (value: string) => void;
  lembretes: any[];
  placeholder?: string;
  className?: string;
}

/**
 * Componente de input com sugestões
 * 
 * @param value - Valor atual do input
 * @param onChange - Função chamada quando o valor muda
 * @param lembretes - Array de lembretes existentes
 * @param placeholder - Texto de placeholder do input
 * @param className - Classes CSS adicionais
 */
export default function SugestoesInput({
  value,
  onChange,
  lembretes,
  placeholder = '',
  className = ''
}: SugestoesInputProps) {
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [sugestaoSelecionada, setSugestaoSelecionada] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Gera sugestões quando o texto muda
  useEffect(() => {
    if (value.trim()) {
      const novasSugestoes = gerarSugestoes(lembretes, value);
      setSugestoes(novasSugestoes);
      setMostrarSugestoes(novasSugestoes.length > 0);
      setSugestaoSelecionada(-1);
    } else {
      setSugestoes([]);
      setMostrarSugestoes(false);
    }
  }, [value, lembretes]);

  // Manipula teclas especiais
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!mostrarSugestoes) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSugestaoSelecionada(prev => 
          prev < sugestoes.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSugestaoSelecionada(prev => prev > -1 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (sugestaoSelecionada >= 0 && sugestaoSelecionada < sugestoes.length) {
          onChange(sugestoes[sugestaoSelecionada]);
          setMostrarSugestoes(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setMostrarSugestoes(false);
        break;
    }
  };

  // Manipula clique em uma sugestão
  const handleSugestaoClick = (sugestao: string) => {
    onChange(sugestao);
    setMostrarSugestoes(false);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setMostrarSugestoes(sugestoes.length > 0)}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      />
      
      {mostrarSugestoes && sugestoes.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {sugestoes.map((sugestao, index) => (
            <button
              key={index}
              onClick={() => handleSugestaoClick(sugestao)}
              className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors ${
                index === sugestaoSelecionada ? 'bg-blue-50' : ''
              }`}
            >
              {sugestao}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 
/**
 * Componente de seleção de data com calendário
 * 
 * Este componente implementa um seletor de data com
 * calendário e opção de selecionar a data de hoje.
 */

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Componente de seleção de data
 * 
 * @param value - Data atual selecionada
 * @param onChange - Função chamada quando a data muda
 * @param className - Classes CSS adicionais
 */
export default function CustomDatePicker({ value, onChange, className = '' }: CustomDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Atualiza a data selecionada quando o valor muda
  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  // Manipula mudança na data
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      // Envia a data em formato ISO
      onChange(date.toISOString());
    }
  };

  return (
    <div className="relative">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        locale={ptBR}
        placeholderText="dd/mm/aaaa"
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer
          ${selectedDate ? 'border-gray-300' : 'border-gray-300'} ${className}`}
        showPopperArrow={false}
        popperClassName="react-datepicker-popper"
        popperPlacement="bottom-start"
        isClearable={false}
        shouldCloseOnSelect={true}
        openToDate={selectedDate || new Date()}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  );
} 
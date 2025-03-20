'use client'

import { useState } from "react";

const HomeClient = () => {
  const [lembrete, setLembrete] = useState('');
  const lista = [
    {
      id: 1,
      lembrete: 'Lembrete 1',
      data: '19/03/2025'
    },
    {
      id: 2,
      lembrete: 'Lembrete 2',
      data: '20/03/2025'
    },
    {
      id: 3,
      lembrete: 'Lembrete 3',
      data: '21/03/2025'
    },
    {
      id: 4,
      lembrete: 'Lembrete 4',
      data: '22/03/2025'
    }
  ]
  console.log(lembrete);
  return (
    <>
      <div className="flex flex-row items-start justify-center h-[5rem] bg-blue-400 gap-4 py-4">
        <input
          type="text"
          placeholder="Lembrete"
          className="border border-blue-500 bg-blue-300 w-[70%] rounded-lg p-2 text-blue-900 outline-none focus:border-blue-900"
          value={lembrete}
          onChange={(e) => {
            setLembrete(e.target.value);
          }}
        />
        <button
          className="border border-blue-900 bg-blue-900 text-white rounded-lg p-2 cursor-pointer"
          onClick={() => {
            console.log("salvar");
          }}
        >
          Salvar
        </button>
      </div>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] bg-blue-300 gap-4 pt-4">
        {lista.map((item) => {
          return (
            <div key={item.id} className="flex flex-row items-center justify-center h-[4rem] bg-blue-400 gap-4 py-4">
              <p>{item.lembrete}</p>
              <p>{item.data}</p>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default HomeClient;
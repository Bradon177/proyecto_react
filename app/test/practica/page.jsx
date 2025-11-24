"use client"
import React, { useState } from 'react'
import Titulo from '../componentes_test/Titulo'
import UseState from '../componentes_test/UseState'
import UseEffect from '../componentes_test/UseEffect'
import Props from '../componentes_test/Props'
import Listas from '../componentes_test/Listas'
import { useRouter } from 'next/navigation'

export default function page() {

  const [valor, setValor]= useState(0)
  const router = useRouter()

  return (
<div>
  <h1 className="text-3xl font-bold text-center text-gray-800">Práctica de componentes</h1>
  
  <table className="table-auto w-full border border-gray-300 text-center content-center">
    <thead>
      <tr>
        <th className="border border-gray-300 px-4 py-2 bg-blue-200">hook</th>
        <th className="border border-gray-300 px-4 py-2 bg-blue-200">Descripción</th>
        <th className="border border-gray-300 px-4 py-2 bg-blue-200">Componente</th>
        <th className="border border-gray-300 px-4 py-2 bg-blue-200">categoria</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border border-gray-300 px-4 py-2">Usestate</td>
        <td className="border border-gray-300 px-4 py-2">Componente que muestra un título</td>
        <td className="border border-gray-300 px-4 py-2"><UseState /></td>
        <td className="border border-gray-300 px-4 py-2">estado</td>
      </tr>
      <tr>
        <td className="border border-gray-300 px-4 py-2">UseNavigate</td>
        <td className="border border-gray-300 px-4 py-2">Componente que muestra la navegación</td>
        <td className="border border-gray-300 px-4 py-2"><a onClick={() => router.push(`/test/navegacion`)}>ir a página</a></td>
        <td className="border border-gray-300 px-4 py-2">navegación</td>
      </tr>
      <tr>
        <td className="border border-gray-300 px-4 py-2">UseEffect</td>
        <td className="border border-gray-300 px-4 py-2">Componente que muestra la hora actual</td>
        <td className="border border-gray-300 px-4 py-2"><UseEffect /></td>
        <td className="border border-gray-300 px-4 py-2">efecto</td>
      </tr>
      
    </tbody>
  </table>

  <h2 className="text-2xl font-bold text-center text-gray-800">categorias y hooks oficiales de react</h2>

  <ul className="list-disc list-inside">
    <li className="text-lg text-gray-700">Debug: useDebugValue</li>
    <li className="text-lg text-gray-700">Estado: useState, useReducer</li>
    <li className="text-lg text-gray-700">Referencias: useRef, useImperativeHandle</li>
    <li className="text-lg text-gray-700">Performance: useMemo, useCallback, useTransition, useDeferredValue</li>
    <li className="text-lg text-gray-700">Efectos: useEffect, useLayoutEffect, useInsertionEffect</li>
    <li className="text-lg text-gray-700">Contexto: useContext, useSyncExternalStore, useId</li>
    <li className="text-lg text-gray-700">Nuevo en React 19: useOptimistic, useFromStatus, useAtionState</li>
  </ul>

  <p className="text-lg text-gray-700">
    Estos hooks son parte de la API de React y están disponibles para su uso en cualquier componente funcional.
  </p>



</div>
  )
}

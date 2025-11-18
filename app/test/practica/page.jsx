import React from 'react'
import Titulo from '../componentes_test/Titulo'
import UseState from '../componentes_test/UseState'

export default function page() {
  return (
    <div>
      {/* Componente basico */}
      <Titulo/>

      {/* prueba de useState */}
      <UseState/>
    </div>
  )
}

import React, { useState } from 'react'

export default function Listas() {

    

    const [listas, setListas]= useState([])
    const [nombre, setNombre]= useState('')

    const  agregar = (e)=>{
        e.preventDefault();

        if(nombre.trim()==='')return

        setListas([...listas, nombre])
        setNombre("")
    }


  return (
    <div>

        <input 
        
        placeholder='Ingresa un dato'
        value={nombre}

        //el onChange lo que permite es manejar los eventos de los inputs
        onChange={(e)=>setNombre(e.target.value)}
        className='bg-white text black'
        
        />

        <p>valor ingresado {nombre}</p>

        <button
        onClick={agregar}
        className='bg-white'
        >
            agregar valor
        </button>

        <ul>
        {
        listas.map((item, index)=>(
            <li key={index}>

                {item}

            </li>
        ))
        }
        </ul>



    </div>
  )
}

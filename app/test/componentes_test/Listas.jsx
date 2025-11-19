import React, { useState } from 'react'

export default function Listas() {

    

    const [listas, setListas]= useState([])
    const [nombre, setNombre]= useState('')


    // esta funcion lo que permite es agregar 

    const  agregar = (e)=>{
        e.preventDefault();

        if(nombre.trim()==='')return

        setListas([...listas, nombre])
        setNombre("")
    }
    // ahora se realiza la funcion de eliminar los elementos

    const eliminar = (index) =>{
        setListas(listas.filter((_,i)=> i !== index))
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
                <button onClick={()=>eliminar(index)}>Eliminar</button>

            </li>
        ))
        }
        </ul>



    </div>
  )
}

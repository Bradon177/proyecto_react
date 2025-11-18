"use client"
import React, { useState } from 'react'

export default function UseState() {
    const [contador, setCotnador]= useState(0)

    const handleClick = ()=>{
        setCotnador(contador+1)
    }
  return (
    <div>
        <button
        onClick={handleClick}
        >
            contador {contador}

        </button>
    </div>
  )
}

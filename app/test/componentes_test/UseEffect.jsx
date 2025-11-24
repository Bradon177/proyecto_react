"use client"
import React, { useState, useEffect } from 'react'

export default function UseEffect () {
const [hora, setHora] = useState(new Date().toLocaleTimeString())
useEffect(() => {
  const interval = setInterval(() => {
    setHora(new Date().toLocaleTimeString())
  }, 1000)
  return () => clearInterval(interval)
}, [])



  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800">Hora actual: {hora}</h2>
    </div>
  )
}

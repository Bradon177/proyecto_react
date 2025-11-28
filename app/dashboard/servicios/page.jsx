"use client"
import React from "react";
import { Code, Smartphone, Cloud, Database, Shield, Zap } from "lucide-react";
import ServiceCard from "../../componets/secciones/servicios/card/ServiceCard";

export default function page() {
    const services = [
    {
      icon: Code,
      title: "Desarrollo Web",
      description: "Creamos aplicaciones web modernas, rápidas y escalables utilizando las últimas tecnologías.",
      features: ["React & Next.js", "APIs RESTful", "Progressive Web Apps", "Optimización SEO"],
      price: "Desde $500.000"
    },
    {
      icon: Smartphone,
      title: "Aplicaciones Móviles",
      description: "Desarrollamos apps nativas y multiplataforma para iOS y Android.",
      features: ["Flutter", "React Native", "UI/UX", "Integración de APIs"],
      price: "Desde $550.000"
    },
    {
      icon: Cloud,
      title: "Soluciones Cloud",
      description: "Infraestructura cloud escalable y segura para tu negocio.",
      features: ["AWS & Azure", "CI/CD", "Microservicios", "Auto-scaling"],
      price: "Desde $660.000"
    },
  

  ];
return (
    <section className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Nuestros{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
              Servicios
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Soluciones tecnológicas creadas para impulsar tu negocio
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

      </div>
    </section>
  );
}

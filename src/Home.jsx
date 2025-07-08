import React from "react";
import BG from "./assets/BG.webp";
import pinGif from "./assets/pin.gif";
import ani from "./assets/ani.webm"
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";

export default function HomePage() {
  return (
    
    <div className="bg-[#0f172a] text-white">
    
      <div
        className="relative bg-cover bg-center h-[90vh] flex items-center text-white"
        style={{
          backgroundImage: `url(${BG})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 max-w-5xl px-8">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Transforming retail supply chains: From inventory management to last-mile delivery
          </h1>
        </div>
      </div>
      <div className="flex justify-center items-center py-12 relative">
  <div className="flex flex-col items-center gap-4 py-8">
  <h3 className="text-gray-300 text-lg text-center max-w-xl font-poppins">
  " Inventory management and last-mile delivery operations, ensuring that the right products reach the right customers at the right time "
</h3>
</div>
  </div>
      <div className="bg-[#0f172a] text-white px-4 py-20">
        <div className="max-w-7xl mx-auto relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-500 opacity-30"/>
  <img
    src={pinGif}
    alt="timeline-dot"
    className="sticky top-1/2 left-[49.3%] transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 z-20 animate-bounce"
  />


          <div className="grid md:grid-cols-2 items-center gap-8 mb-32 relative">
            <div className="flex flex-col space-y-6 relative z-10">
              <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
              <ul className="list-disc text-gray-300 pl-5 text-lg space-y-2">
                <li>inventory management, helping retailers maintain optimal stock levels and prevent both shortages and overstock</li>
                <li>real-time inventory tracking or hyper-local fulfillment centers</li>
                <li>Predictive demand analysis for better stock allocation</li>
              </ul>
<Link to="/inventory">
  <button className="bg-green-500 px-6 py-2 rounded hover:bg-green-600 w-fit">
    SEE HOW IT WORKS
  </button>
</Link>
            </div>
            <div className="hidden md:block" /> </div>
          <div className="grid md:grid-cols-2 items-center gap-8 mb-32 relative">
            <div className="hidden md:block" />
            <div className="flex flex-col space-y-6 relative z-10">
              <h2 className="text-3xl font-bold text-white">Last-Mile Delivery</h2>
              <p className="list-disc text-gray-300 pl-5 text-lg space-y-2">
                <li>Smart Route Optimization For Delivery</li>
                <li>Smart Manage Of Retails With Delivery</li>
              </p>
<a href="/LastMile" target="_blank" rel="noopener noreferrer">
  <button className="bg-green-500 px-6 py-2 rounded hover:bg-green-600 w-fit">
    UNCOVER THE BENEFITS
  </button>
</a>          
 <div className="bg-[#0f172a] text-white">
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
            100% { transform: translateY(0); }
          }

          .float {
            animation: float 2s ease-in-out infinite;
          }
        `}
      </style>
    </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}

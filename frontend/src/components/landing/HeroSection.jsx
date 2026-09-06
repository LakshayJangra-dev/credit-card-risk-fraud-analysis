import React from "react";
import IsometricCanvas from "./IsometricCanvas";

export default function HeroSection() {
  return (
    <section className="pt-20 pb-20 px-6 max-w-7xl mx-auto text-center relative z-10">
      <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
        Securing your fintech journey from day one
      </h1>

      <p className="mt-6 text-lg sm:text-xl text-[#8A93A6] max-w-2xl mx-auto font-normal leading-relaxed">
        Build secure fintech products to safeguard your users data
      </p>

      {/* Dynamic Isometric Flow Diagram */}
      <IsometricCanvas />
    </section>
  );
}

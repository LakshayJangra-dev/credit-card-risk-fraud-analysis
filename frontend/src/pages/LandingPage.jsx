import React, { useState } from "react";
import HeaderNav from "../components/landing/HeaderNav";
import HeroSection from "../components/landing/HeroSection";
import FeaturesGrid from "../components/landing/FeaturesGrid";
import InfoModals from "../components/landing/InfoModals";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  const [activeModal, setActiveModal] = useState(null); // 'docs' | 'pricing' | 'security' | 'company' | 'contacts' | null

  return (
    <div className="min-h-screen bg-[#0A0D12] text-[#E7EAF0] selection:bg-[#8B5CF6]/30 font-sans relative overflow-x-hidden">
      {/* Background Glow Highlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#8B5CF6]/15 via-[#FF6B4A]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[600px] right-0 w-[500px] h-[500px] bg-[#8B5CF6]/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[800px] left-0 w-[500px] h-[500px] bg-[#FF6B4A]/10 blur-[150px] pointer-events-none" />

      {/* Header Navigation */}
      <HeaderNav onOpenModal={setActiveModal} />

      {/* Hero Headline & Isometric Visual Diagram */}
      <HeroSection />

      {/* 3-Column Feature Props */}
      <FeaturesGrid />

      {/* Page Footer */}
      <Footer onOpenModal={setActiveModal} />

      {/* Information Dialog Modals */}
      <InfoModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}

import React from "react";
import { X, Code2, Lock, Check } from "lucide-react";

export default function InfoModals({ activeModal, onClose }) {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#11161F] border border-[#262E39] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8A93A6] hover:text-white p-1 rounded-lg hover:bg-[#1E2633]"
        >
          <X className="w-5 h-5" />
        </button>

        {activeModal === "docs" && (
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Code2 className="text-[#8B5CF6]" /> REST API Documentation
            </h3>
            <p className="text-sm text-[#8A93A6] mb-4">
              Integrate risk scoring directly into your payment or loan workflow via standard JSON APIs.
            </p>
            <div className="bg-[#0A0D12] border border-[#262E39] rounded-xl p-4 font-mono text-xs space-y-3 text-[#E7EAF0]">
              <div>
                <span className="text-[#3FB37F] font-bold">POST</span> /auth/login
              </div>
              <div>
                <span className="text-[#3FB37F] font-bold">POST</span> /credit/score
              </div>
              <div>
                <span className="text-[#3FB37F] font-bold">POST</span> /fraud/score
              </div>
            </div>
          </div>
        )}

        {activeModal === "pricing" && (
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-2">Pricing Plans</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="border border-[#262E39] rounded-xl p-4 bg-[#0A0D12]">
                <div className="font-bold text-white">Developer</div>
                <div className="text-2xl font-bold text-[#8B5CF6] mt-1">$0 / mo</div>
                <div className="text-xs text-[#8A93A6] mt-2">1,000 Risk checks / month included.</div>
              </div>
              <div className="border border-[#8B5CF6] rounded-xl p-4 bg-[#8B5CF6]/10">
                <div className="font-bold text-white">Enterprise</div>
                <div className="text-2xl font-bold text-[#A78BFA] mt-1">Custom</div>
                <div className="text-xs text-[#8A93A6] mt-2">Unlimited checks + custom XGBoost models.</div>
              </div>
            </div>
          </div>
        )}

        {activeModal === "security" && (
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Lock className="text-[#3FB37F]" /> Security Architecture
            </h3>
            <ul className="text-sm text-[#8A93A6] space-y-2 mt-4">
              <li className="flex items-center gap-2"><Check className="text-[#3FB37F] w-4 h-4"/> Werkzeug password hashing</li>
              <li className="flex items-center gap-2"><Check className="text-[#3FB37F] w-4 h-4"/> SQLite isolated backend storage</li>
              <li className="flex items-center gap-2"><Check className="text-[#3FB37F] w-4 h-4"/> JWT Bearer Token validation on every endpoint</li>
            </ul>
          </div>
        )}

        {(activeModal === "company" || activeModal === "contacts") && (
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-2">Contact & Team</h3>
            <p className="text-sm text-[#8A93A6]">
              DigitalWall Fintech Risk Engine. Developed by Lakshay & Kunal Jangra.
            </p>
            <div className="mt-4 pt-4 border-t border-[#262E39] text-xs text-[#8A93A6]">
              Email: kunaljangra9828@gmail.com
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

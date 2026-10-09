import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage({ setCurrentPage }) {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI-Powered Peer Skill Exchange for University Students</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Teach what you know. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Learn what you want.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            SkillSwap uses semantic AI to discover students with complementary skills on campus. Match directly, exchange knowledge peer-to-peer, and grow together.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]"
            >
              <span>Explore Best Matches</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage('profile')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm shadow-sm transition-all hover:scale-[1.02]"
            >
              <span>Create My Profile</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/70 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-base">Natural Skill Input</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Express your skills freely without being confined to rigid predefined dropdowns. Tell the platform what you love doing.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/70 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-base">Intelligent AI Matching</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Google Gemini evaluates both what you can teach and what you want to learn to identify reciprocal bilateral exchange opportunities.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/70 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-base">Direct Connection</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review AI match explanations, examine experience levels, and initiate peer-to-peer learning with a single click.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

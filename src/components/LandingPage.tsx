import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from './FirebaseProvider';
import { Shield, Users, Lock, ChevronRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden selection:bg-yellow-500 selection:text-black">
      <main className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        {/* Left Side: Pitch */}
        <section className="flex flex-col justify-center p-12 md:p-16 lg:p-24 border-r border-white/5 relative">
          <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500/5 blur-[120px] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-yellow-500 text-black p-2 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                <Shield size={24} className="stroke-[2.5]" />
              </div>
              <span className="font-black tracking-[0.3em] text-2xl uppercase italic">VIC</span>
            </div>
            
            <h1 className="text-[14vw] lg:text-[10vw] font-black leading-[0.82] tracking-tighter mb-10 uppercase italic">
              YOUR<br />
              CIRCLE.<br />
              YOUR RULES.
            </h1>
            
            <p className="max-w-md text-xl text-white/40 mb-14 font-medium leading-tight">
              The sovereign messaging OS for Indian creator networks and masterminds. Stop WhatsApp chaos. Take back absolute control.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={signInWithGoogle}
                className="flex items-center justify-between gap-6 bg-yellow-500 text-black px-10 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(234,179,8,0.2)]"
              >
                Establish Sovereignty
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>

          <motion.div 
            className="mt-32 grid grid-cols-2 gap-10 border-t border-white/5 pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20 mb-3 italic">Protocol</div>
              <div className="font-black text-sm uppercase tracking-tight text-white/60">Unlimited Nodes. Global Verification.</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20 mb-3 italic">Authority</div>
              <div className="font-black text-sm uppercase tracking-tight text-white/60">Sovereign Gatekeeper Pattern.</div>
            </div>
          </motion.div>
        </section>

        {/* Right Side: Visual/Abstract */}
        <section className="hidden lg:flex relative bg-[#0F0F0F] items-center justify-center p-12 overflow-hidden">
          {/* Animated Background Grids/Glows */}
          <div className="absolute inset-0">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/[0.02] rounded-full" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/[0.03] rounded-full" />
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] animate-pulse" />
          </div>
          
          <div className="relative z-10 w-full max-w-lg">
            <motion.div 
              className="bg-[#121212] p-10 rounded-[3rem] shadow-2xl border border-white/5 space-y-8 relative overflow-hidden group"
              initial={{ rotate: -4, y: 50, opacity: 0 }}
              animate={{ rotate: -4, y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', damping: 20 }}
            >
              <div className="absolute top-0 right-0 p-8 text-[120px] font-black text-white/[0.02] pointer-events-none uppercase italic leading-none">QUEUE</div>
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-white/10 rounded" />
                  <div className="h-3 w-48 bg-white/5 rounded" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[9px] font-black uppercase tracking-[0.2em] italic">Pending Verification</div>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="h-4 w-full bg-white/[0.03] rounded" />
                <div className="h-4 w-3/4 bg-white/[0.03] rounded" />
              </div>
              
              <div className="flex gap-4 pt-6 relative z-10">
                <div className="h-14 flex-1 bg-white rounded-2xl flex items-center justify-center text-black text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-colors cursor-pointer">Grant Access</div>
                <div className="h-14 flex-1 bg-transparent border border-white/10 rounded-2xl flex items-center justify-center text-white/30 text-xs font-black uppercase tracking-widest hover:border-red-500/20 hover:text-red-500 transition-all cursor-pointer">Exile</div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -top-16 -right-8 bg-white text-black p-8 rounded-[2.5rem] shadow-2xl w-56 transform rotate-6 border-4 border-yellow-500"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Lock className="text-black mb-4 stroke-[3]" size={24} />
              <div className="text-sm font-black uppercase tracking-tight leading-none mb-1">SOVEREIGN MODE</div>
              <div className="text-black/40 text-[10px] font-bold uppercase tracking-widest mt-2 leading-tight">Privacy shielding active. All data masked.</div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

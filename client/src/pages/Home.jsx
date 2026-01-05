import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, Zap, Star, ArrowRight, CheckCircle, 
  Hammer, Droplets, Wind, Lightbulb, PenTool, MousePointer2 
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const services = [
    { name: "Plumbing", icon: <Droplets size={20}/> },
    { name: "Electrical", icon: <Lightbulb size={20}/> },
    { name: "AC Repair", icon: <Wind size={20}/> },
    { name: "Carpentry", icon: <Hammer size={20}/> },
    { name: "Cleaning", icon: <Zap size={20}/> },
    { name: "Design", icon: <PenTool size={20}/> }
  ];

  return (
    <div className="min-h-screen bg-[#05070a] text-white font-sans overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* 1. ADVANCED ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[800px] bg-emerald-600/5 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-violet-600/5 blur-[160px] rounded-full" />
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-emerald-400/5 blur-[120px] rounded-full" />
      </div>

      {/* 2. PREMIUM NAVIGATION */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-10 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            <span className="text-2xl font-black text-white">S</span>
          </motion.div>
          <span className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            ServiFlow
          </span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">
          <Link to="/" className="hover:text-emerald-400 transition-all cursor-pointer">How it works</Link>
          <Link to="/" className="hover:text-emerald-400 transition-all cursor-pointer">Services</Link>
          <Link to="/" className="hover:text-emerald-400 transition-all cursor-pointer">Safety</Link>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/login')} className="hidden sm:block font-black text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer">Login</button>
          <button 
            onClick={() => navigate('/register')} 
            className="group relative bg-white text-black px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95 shadow-2xl flex items-center gap-2 cursor-pointer"
          >
            Join Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      {/* 3. HERO SECTION - BOLD & SPACIOUS */}
      <section className="relative z-10 pt-32 pb-20 flex flex-col items-center text-center px-6">
        <motion.div 
          initial="hidden" animate="visible" variants={fadeInUp}
          className="bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 rounded-full mb-10 flex items-center gap-3 backdrop-blur-md"
        >
          <Zap size={14} className="text-emerald-400 animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300">Next Generation Home Infrastructure</span>
        </motion.div>

        <motion.h1 
          initial="hidden" animate="visible" variants={fadeInUp}
          className="text-7xl md:text-[120px] font-black tracking-tighter leading-[0.8] mb-12"
        >
          Quality Services. <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-100 to-violet-400">
            Simplified.
            <motion.div 
              initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1, duration: 1.5 }}
              className="absolute -bottom-4 left-0 h-[8px] bg-emerald-500/20 blur-sm rounded-full" 
            />
          </span>
        </motion.h1>

        <motion.p 
          initial="hidden" animate="visible" variants={fadeInUp}
          className="text-gray-500 text-lg md:text-2xl max-w-3xl mb-16 font-medium leading-relaxed"
        >
          Connecting India’s most skilled professionals with homeowners who demand precision. 
          Vetted, verified, and delivered in flow.
        </motion.p>

        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="flex flex-col sm:flex-row gap-6">
          <button 
            onClick={() => navigate('/register')} 
            className="group bg-emerald-600 px-12 py-6 rounded-[2rem] font-black text-lg flex items-center gap-4 hover:bg-emerald-500 transition-all shadow-[0_30px_60px_rgba(16,185,129,0.25)] active:scale-95 cursor-pointer"
          >
            Find an Expert <MousePointer2 size={20} className="group-hover:scale-125 transition-transform" />
          </button>
          <button 
            onClick={() => navigate('/register')} 
            className="bg-[#0d1117] border border-white/10 px-12 py-6 rounded-[2rem] font-black text-lg hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
          >
            Partner with us
          </button>
        </motion.div>
      </section>

      {/* 4. SERVICE MARQUEE - GLASS EFFECT */}
      <div className="relative py-24 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent pointer-events-none" />
        <div className="flex whitespace-nowrap gap-12 animate-scroll px-10">
          {[...services, ...services, ...services].map((s, i) => (
            <div key={i} className="flex items-center gap-5 bg-white/[0.03] border border-white/5 px-10 py-6 rounded-[2rem] backdrop-blur-md group hover:border-emerald-500/30 transition-all cursor-pointer shadow-xl">
              <span className="text-emerald-400 group-hover:scale-125 transition-transform">{s.icon}</span>
              <span className="font-black text-2xl uppercase tracking-tighter text-gray-400 group-hover:text-white transition-colors">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. PROCESS SECTION - MINIMALIST CARDS */}
      <section className="max-w-7xl mx-auto px-6 py-40 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
              How it <span className="text-emerald-500 italic">flows.</span>
            </h2>
            <p className="text-gray-500 text-xl font-medium">The blueprint of a premium experience.</p>
          </div>
          <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest text-emerald-400">
            3-Step Protocol
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <ProcessStep number="01" title="Define Need" desc="Select your specific requirement and get instant hourly transparency." />
          <ProcessStep number="02" title="Pro Matching" desc="Our algorithm matches you with the highest-rated expert in your zone." />
          <ProcessStep number="03" title="Flow Payment" desc="Secure, one-tap checkout after your total satisfaction is confirmed." />
        </div>
      </section>

      {/* 6. FEATURES BENTO GRID */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<ShieldCheck size={36} className="text-emerald-400"/>} 
            title="Ironclad Security" 
            desc="Every professional is background checked and verified for total security." 
          />
          <FeatureCard 
            icon={<Star size={36} className="text-violet-400"/>} 
            title="Elite Ratings" 
            desc="We only maintain the top 5% of service providers in our premium network." 
          />
          <FeatureCard 
            icon={<CheckCircle size={36} className="text-emerald-400"/>} 
            title="Flow Warranty" 
            desc="Full protection on every job. We ensure excellence, or it's on us." 
          />
        </div>
      </section>

      {/* 7. THE FINAL CTA - MINIMALIST GLOSS */}
      <footer className="max-w-7xl mx-auto px-6 py-40 relative z-10 text-center">
        <div className="relative group p-20 rounded-[4rem] border border-white/5 bg-white/[0.01] backdrop-blur-2xl overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
          
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ duration: 4, repeat: Infinity }}
            className="w-20 h-20 bg-[#05070a] border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl"
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_25px_rgba(16,185,129,0.5)]">S</div>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
            Elevate your standards. <br /> 
            <span className="text-gray-500 group-hover:text-emerald-400 transition-colors">Start the flow.</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <button 
              onClick={() => navigate('/register')}
              className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-500 transition-all shadow-xl cursor-pointer"
            >
              Initialize Account
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all cursor-pointer"
            >
              Member Portal
            </button>
          </div>
        </div>

        {/* 8. FOOTER METADATA */}
        <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-3 items-center md:items-start">
            <span className="text-2xl font-black tracking-tighter">ServiFlow</span>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Network Protocol: Active
            </div>
          </div>

          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
            <Link to="/" className="hover:text-emerald-400 transition-colors cursor-pointer">Privacy</Link>
            <Link to="/" className="hover:text-emerald-400 transition-colors cursor-pointer">Terms</Link>
            <Link to="/" className="hover:text-emerald-400 transition-colors cursor-pointer">Security</Link>
          </div>

          <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em]">
            © 2026 ServiFlow Core
          </p>
        </div>
      </footer>
    </div>
  );
};

/* COMPONENT: PROCESS STEP */
const ProcessStep = ({ number, title, desc }) => (
  <div className="group flex flex-col p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:bg-white/[0.04] transition-all cursor-default">
    <div className="text-5xl font-black text-emerald-500/20 group-hover:text-emerald-500 transition-colors mb-8">
      {number}
    </div>
    <h3 className="text-3xl font-black mb-4 tracking-tighter">{title}</h3>
    <p className="text-gray-500 text-lg leading-relaxed font-medium">{desc}</p>
  </div>
);

/* COMPONENT: FEATURE CARD */
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-[#0d1117] border border-white/5 p-12 rounded-[4rem] hover:border-emerald-500/30 transition-all group cursor-default shadow-2xl">
    <div className="mb-10 bg-white/5 w-20 h-20 rounded-[2rem] flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all">
      {icon}
    </div>
    <h3 className="text-3xl font-black mb-4 tracking-tighter">{title}</h3>
    <p className="text-gray-500 text-lg leading-relaxed font-medium">{desc}</p>
  </div>
);

export default Home;
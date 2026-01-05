import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

const StatusModal = ({ isOpen, message, type = 'success', onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Dark Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          {/* Modal Card - Midnight Emerald Theme */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="relative bg-[#0d1117] border border-white/5 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-sm w-full text-center overflow-hidden"
          >
            {/* Background Glow inside modal */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 ${type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />

            <div className="flex justify-center mb-6 relative z-10">
              {type === 'success' ? (
                <div className="bg-emerald-500/10 p-5 rounded-full border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <CheckCircle2 size={42} className="text-emerald-500" />
                </div>
              ) : (
                <div className="bg-rose-500/10 p-5 rounded-full border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                  <XCircle size={42} className="text-rose-500" />
                </div>
              )}
            </div>
            
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight relative z-10">
              {type === 'success' ? 'Successful' : 'Alert'}
            </h3>
            <p className="text-gray-400 font-medium mb-8 leading-relaxed px-2 relative z-10 text-sm">
              {message}
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-lg relative z-10 ${
                type === 'success' 
                ? 'bg-emerald-600 text-white shadow-emerald-900/20 hover:bg-emerald-500' 
                : 'bg-rose-600 text-white shadow-rose-900/20 hover:bg-rose-500'
              }`}
            >
              Continue
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StatusModal;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import StatusModal from '../components/StatusModal';

const Register = () => {
  const [role, setRole] = useState('Customer'); 
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', lastName: '',
    businessName: '', serviceType: 'Plumbing', hourlyRate: ''
  });
  const [modal, setModal] = useState({ open: false, msg: '', type: 'success' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/auth/register', { ...formData, role });
      setModal({ open: true, msg: "Account created successfully! Welcome to the family.", type: 'success' });
    } catch (err) {
      setModal({ open: true, msg: err.response?.data?.message || "Registration Failed", type: 'error' });
    }
  };

  const handleModalClose = () => {
    setModal({ ...modal, open: false });
    if (modal.type === 'success') navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#05070a] relative overflow-hidden">
      <StatusModal isOpen={modal.open} message={modal.msg} type={modal.type} onClose={handleModalClose} />
      
      {/* Aurora Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-white/5 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-white tracking-tight">Join <span className="text-emerald-400">ServiFlow</span></h2>
          <p className="text-gray-400 mt-2 font-medium italic">India's premium service network</p>
        </div>

        <div className="flex bg-black/40 p-1.5 rounded-2xl mb-8 border border-white/5 shadow-inner">
          {['Customer', 'Provider'].map((r) => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className={`flex-1 py-3 rounded-xl font-black transition-all duration-300 uppercase text-xs tracking-widest ${role === r ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-white'}`}
            >
              {r === 'Customer' ? 'Need Service' : 'Provide Service'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <Input label="First Name" placeholder="Rahul" onChange={e => setFormData({...formData, firstName: e.target.value})} />
            <Input label="Last Name" placeholder="Sharma" onChange={e => setFormData({...formData, lastName: e.target.value})} />
            <Input label="Email Address" type="email" placeholder="rahul@example.com" onChange={e => setFormData({...formData, email: e.target.value})} />
            <Input label="Password" type="password" placeholder="••••••••" onChange={e => setFormData({...formData, password: e.target.value})} />

            <AnimatePresence mode="wait">
              {role === 'Provider' && (
                <>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="col-span-1">
                    <Input label="Business Name" placeholder="Rahul Electricals" onChange={e => setFormData({...formData, businessName: e.target.value})} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="col-span-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Service Expertise</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
                      onChange={e => setFormData({...formData, serviceType: e.target.value})}
                    >
                      <option className="bg-[#0d1117]" value="Plumbing">Plumbing</option>
                      <option className="bg-[#0d1117]" value="Electrical">Electrical</option>
                      <option className="bg-[#0d1117]" value="Cleaning">Home Cleaning</option>
                      <option className="bg-[#0d1117]" value="Carpentry">Carpentry</option>
                      <option className="bg-[#0d1117]" value="AC Repair">AC Repair</option>
                    </select>
                  </motion.div>
                  <div className="md:col-span-2">
                    <Input label="Charges per Hour (₹)" type="number" placeholder="500" onChange={e => setFormData({...formData, hourlyRate: e.target.value})} />
                  </div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-10 space-y-4">
            <motion.button 
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-900/20 text-lg uppercase tracking-widest transition-all"
            >
              Get Started
            </motion.button>
            <p className="text-center text-gray-400 font-medium">Already a member? <Link to="/login" className="text-emerald-400 font-black hover:text-emerald-300 ml-1 border-b border-emerald-400/20">Sign In</Link></p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Input = ({ label, type = "text", placeholder, onChange }) => (
  <div className="w-full">
    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">{label}</label>
    <input 
      type={type} required placeholder={placeholder} onChange={onChange}
      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-600 shadow-inner" 
    />
  </div>
);

export default Register;
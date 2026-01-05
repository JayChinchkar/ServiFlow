import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import StatusModal from '../components/StatusModal';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [modal, setModal] = useState({ open: false, msg: '', type: 'success' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/api/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setModal({ open: true, msg: `Welcome back, ${data.user.firstName}! Accessing your dashboard...`, type: 'success' });
    } catch (err) {
      setModal({ open: true, msg: err.response?.data?.message || "Invalid Email or Password", type: 'error' });
    }
  };

  const handleModalClose = () => {
    setModal({ ...modal, open: false });
    if (modal.type === 'success') navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#05070a] relative overflow-hidden">
      {/* Aurora Background Effects - Matching Dashboard */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />

      <StatusModal isOpen={modal.open} message={modal.msg} type={modal.type} onClose={handleModalClose} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 border border-white/5 relative z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white tracking-tight">Welcome <span className="text-emerald-400">Back</span></h2>
          <p className="text-gray-400 mt-3 font-medium italic">Manage your ServiFlow bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-300 ml-1 uppercase tracking-widest text-[10px]">Email Address</label>
            <input 
              type="email" placeholder="rahul@example.com"
              className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-600"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-300 ml-1 uppercase tracking-widest text-[10px]">Security Password</label>
            <input 
              type="password" placeholder="••••••••"
              className="w-full px-5 py-4 rounded-2xl border border-white/10 bg-white/5 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-600"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-900/20 transition-all text-lg tracking-widest uppercase"
          >
            SIGN IN
          </motion.button>
        </form>

        <div className="text-center mt-10">
          <p className="text-gray-400 font-medium">New to the flow? <Link to="/register" className="text-emerald-400 font-black hover:text-emerald-300 ml-2 border-b border-emerald-400/30">Join Now</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
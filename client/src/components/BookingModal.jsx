import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, X, MapPin, Phone, MessageSquare, ClipboardList } from 'lucide-react';
import API from '../api';

const BookingModal = ({ isOpen, provider, onClose, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    serviceDate: '',
    startTime: '',
    endTime: '',
    problemDescription: '',
    address: '',
    phoneNumber: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Final validation check for 10 digits
    if (formData.phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      await API.post('/api/bookings', {
        providerId: provider._id,
        ...formData
      });
      onBookingSuccess("Booking request sent! The provider will review it shortly.");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    }
  };

  // Helper function to handle phone input
  const handlePhoneChange = (e) => {
    // Remove all non-numeric characters
    const value = e.target.value.replace(/\D/g, "");
    // Only update if it's 10 characters or less
    if (value.length <= 10) {
      setFormData({ ...formData, phoneNumber: value });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-[#161b2c] border border-white/10 p-8 rounded-[3rem] shadow-2xl max-w-4xl w-full z-120 overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
              <X size={28} />
            </button>

            <header className="mb-8">
              <h3 className="text-3xl font-black text-white flex items-center gap-3">
                <ClipboardList className="text-indigo-500" /> Book {provider.businessName}
              </h3>
              <p className="text-indigo-400 font-bold uppercase text-xs tracking-[0.2em] mt-1 ml-9">
                {provider.serviceType} Specialist
              </p>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Appointment Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                    <input type="date" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e) => setFormData({...formData, serviceDate: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Start Time</label>
                    <input type="time" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">End Time</label>
                    <input type="time" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
                    <input 
                      type="tel" 
                      placeholder="Enter 10 digit number" 
                      required 
                      value={formData.phoneNumber}
                      onChange={handlePhoneChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 ml-1 italic">
                    {formData.phoneNumber.length}/10 digits
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Service Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-indigo-500" size={18} />
                    <textarea placeholder="Your full address..." required rows="2" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Problem Description</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-indigo-500" size={18} />
                    <textarea placeholder="Describe what needs to be fixed..." required rows="4" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      onChange={(e) => setFormData({...formData, problemDescription: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <motion.button
                  whileHover={{ scale: 1.01, backgroundColor: "#4f46e5" }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-indigo-600 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-indigo-500/20 text-xl uppercase tracking-widest transition-all"
                >
                  Confirm Appointment Request
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
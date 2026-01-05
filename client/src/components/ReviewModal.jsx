import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, MessageSquare } from 'lucide-react';
import API from '../api';

const ReviewModal = ({ isOpen, booking, onClose, onReviewSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating!");

    try {
      await API.post(`/api/reviews`, {
        bookingId: booking._id,
        providerId: booking.provider._id,
        rating,
        comment
      });
      onReviewSuccess("Thank you for your feedback!");
      onClose();
    } catch (err) {
      alert("Failed to submit review. You might have already reviewed this service.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/90 backdrop-blur-md" />
          
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-[#161b2c] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full z-130"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={24} /></button>
            <h3 className="text-2xl font-black text-white mb-2">Rate your Experience</h3>
            <p className="text-indigo-400 text-sm mb-6">How was your service with {booking.provider.businessName}?</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" 
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform active:scale-90"
                  >
                    <Star size={36} fill={(hover || rating) >= star ? "#6366f1" : "none"} 
                      className={(hover || rating) >= star ? "text-indigo-500" : "text-gray-600"} />
                  </button>
                ))}
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-gray-500" size={18} />
                <textarea placeholder="Write a brief review..." rows="3"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <button className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-xl hover:bg-indigo-500 transition-all uppercase tracking-widest">
                Submit Review
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;
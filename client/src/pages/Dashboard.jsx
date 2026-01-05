import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Calendar, Clock, IndianRupee, Star, LogOut, 
  Briefcase, CheckCircle2, Clock4, MapPin, Phone, 
  MessageSquare, XCircle, Award, Filter, BarChart3, Settings, Save, Zap, ArrowUpDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import BookingModal from '../components/BookingModal';
import StatusModal from '../components/StatusModal';
import ReviewModal from '../components/ReviewModal';

const Dashboard = () => {
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  const [data, setData] = useState([]); 
  const [customerBookings, setCustomerBookings] = useState([]); 
  const [activeTab, setActiveTab] = useState('search'); 
  const [bookingFilter, setBookingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [modal, setModal] = useState({ open: false, msg: '', type: 'success' });
  
  const [isOnline, setIsOnline] = useState(true);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileData, setProfileData] = useState({ bio: '', skills: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setRole(user.role);
      setUserName(user.firstName);
      setIsOnline(user.isOnline ?? true);
      const skillsArray = Array.isArray(user.skills) ? user.skills : [];
      setProfileData({ bio: user.bio || '', skills: skillsArray.join(', ') });
      refreshData(user.role);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const refreshData = (currentRole) => {
    if (currentRole === 'Provider') {
      fetchProviderSchedule();
    } else {
      fetchAllProviders();
      fetchCustomerBookings();
    }
  };

  const fetchProviderSchedule = async () => {
    try {
      const { data } = await API.get('/api/bookings/my-schedule');
      setData(data);
    } catch (err) { console.error("Error fetching schedule:", err); }
  };

  const fetchCustomerBookings = async () => {
    try {
      const { data } = await API.get('/api/bookings/my-bookings'); 
      setCustomerBookings(data);
    } catch (err) { console.error("Error fetching bookings:", err); }
  };

  const fetchAllProviders = async (service = '') => {
    try {
      const url = service.trim() 
        ? `/api/customers/search?service=${encodeURIComponent(service)}` 
        : '/api/customers/search';
      const { data } = await API.get(url);
      setData(data);
    } catch (err) { console.error("Error searching providers:", err); }
  };

  const getSortedProviders = () => {
    let sortedList = [...data];
    if (sortBy === 'priceLow') sortedList.sort((a, b) => a.hourlyRate - b.hourlyRate);
    else if (sortBy === 'priceHigh') sortedList.sort((a, b) => b.hourlyRate - a.hourlyRate);
    else if (sortBy === 'rating') sortedList.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    return sortedList;
  };

  const toggleAvailability = async () => {
    try {
      const newStatus = !isOnline;
      const response = await API.patch('/api/users/profile', { isOnline: newStatus });
      setIsOnline(newStatus);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setModal({ open: true, msg: `Status: ${newStatus ? 'Online' : 'Offline'}`, type: 'success' });
    } catch (err) { setModal({ open: true, msg: "Update failed", type: 'error' }); }
  };

  const saveProfile = async () => {
    try {
      const formattedSkills = profileData.skills ? profileData.skills.split(',').map(s => s.trim()).filter(s => s !== "") : [];
      const response = await API.patch('/api/users/profile', { bio: profileData.bio, skills: formattedSkills });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setProfileData({
        bio: response.data.user.bio || '',
        skills: Array.isArray(response.data.user.skills) ? response.data.user.skills.join(', ') : ''
      });
      setShowProfileEdit(false);
      setModal({ open: true, msg: "Profile updated successfully!", type: 'success' });
    } catch (err) { setModal({ open: true, msg: "Save failed", type: 'error' }); }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await API.patch(`/api/bookings/${bookingId}`, { status: newStatus });
      setModal({ open: true, msg: `Marked as ${newStatus}`, type: 'success' });
      refreshData(role);
    } catch (err) { setModal({ open: true, msg: "Update failed", type: 'error' }); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const completedJobs = data.filter(b => b.status === 'completed');
  const confirmedJobs = data.filter(b => b.status === 'confirmed');
  const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.provider?.hourlyRate || 0), 0);

  const getWeeklyStats = () => {
    const stats = [];
    const dailyTotals = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString();
      const dayTotal = data
        .filter(b => b.status === 'completed' && new Date(b.serviceDate).toLocaleDateString() === dateStr)
        .reduce((sum, b) => sum + (b.provider?.hourlyRate || 0), 0);
      dailyTotals.push(dayTotal);
      stats.push({ date: dateStr, amount: dayTotal, label: d.toLocaleDateString('en-US', { weekday: 'short' }) });
    }
    const maxDay = Math.max(...dailyTotals, 100);
    return stats.map(s => ({ ...s, height: s.amount > 0 ? Math.max((s.amount / maxDay) * 100, 15) : 5 }));
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-4 md:p-12 relative overflow-hidden font-sans">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />

      <BookingModal isOpen={isBookingOpen} provider={selectedProvider} onClose={() => setIsBookingOpen(false)} onBookingSuccess={(msg) => { setModal({ open: true, msg, type: 'success' }); fetchCustomerBookings(); }} />
      <ReviewModal isOpen={isReviewOpen} booking={selectedBooking} onClose={() => setIsReviewOpen(false)} onReviewSuccess={(msg) => { setModal({ open: true, msg, type: 'success' }); fetchCustomerBookings(); }} />
      <StatusModal isOpen={modal.open} message={modal.msg} type={modal.type} onClose={() => setModal({ ...modal, open: false })} />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <div className="flex items-center gap-6 mb-2">
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter">Hi, <span className="text-emerald-400">{userName}</span></h1>
                
                {/* ACTIONS GROUP */}
                <div className="flex items-center gap-3">
                    {role === 'Provider' && (
                      <button 
                        onClick={() => setShowProfileEdit(!showProfileEdit)} 
                        className={`p-3 rounded-2xl transition-all shadow-xl border ${showProfileEdit ? 'bg-violet-600 border-violet-400 text-white' : 'bg-violet-500/10 border-violet-500/30 text-violet-400 hover:bg-violet-500 hover:text-white'}`}
                        title="Profile Settings"
                      >
                        <Settings size={22} />
                      </button>
                    )}
                    <button 
                        onClick={handleLogout} 
                        className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl"
                        title="Logout"
                    >
                        <LogOut size={22} />
                    </button>
                </div>
            </div>
            <p className="text-gray-400 font-medium text-lg italic">{role === 'Provider' ? "Professional Performance Analytics" : "Premium services delivered to your door"}</p>
          </div>

          <div className="flex items-center gap-4">
            {role === 'Provider' && (
              <div className="flex items-center gap-3 bg-white/5 p-2 px-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
                <button onClick={toggleAvailability} className={`relative w-11 h-6 rounded-full transition-all ${isOnline ? 'bg-emerald-600' : 'bg-gray-700'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isOnline ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            )}
            
            {role === 'Customer' && (
              <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md shadow-inner">
                  <button onClick={() => setActiveTab('search')} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'search' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Find Experts</button>
                  <button onClick={() => setActiveTab('bookings')} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'bookings' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>My Requests</button>
              </div>
            )}
          </div>
        </header>

        {/* --- PROFILE EDIT PANEL --- */}
        <AnimatePresence>
          {showProfileEdit && role === 'Provider' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-12 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 overflow-hidden backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black flex items-center gap-2"><Zap className="text-emerald-400" /> Professional Profile</h3>
                <button onClick={() => setShowProfileEdit(false)} className="text-gray-500 hover:text-white"><XCircle size={20}/></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Professional Bio</label>
                  <textarea value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none h-32 transition-all" placeholder="E.g. Engineering student specializing in MERN stack..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Skills (comma separated)</label>
                  <input type="text" value={profileData.skills} onChange={(e) => setProfileData({...profileData, skills: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="React, Node.js, VLSI..." />
                </div>
              </div>
              <button onClick={saveProfile} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-xl font-black text-xs uppercase flex items-center gap-2 tracking-widest transition-all shadow-lg active:scale-95">
                <Save size={16} /> Save Changes
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- PROVIDER ANALYTICS --- */}
        {role === 'Provider' && !showProfileEdit && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-sm shadow-xl">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-xl font-black flex items-center gap-2"><BarChart3 className="text-emerald-400"/> Revenue Activity</h3>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Weekly Overview</span>
              </div>
              <div className="flex items-end justify-between gap-4 h-56 px-4">
                {getWeeklyStats().map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                    <div className="relative w-full flex justify-center items-end h-full">
                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-emerald-600 text-white text-[10px] px-3 py-1.5 rounded-lg font-black shadow-2xl z-20 pointer-events-none whitespace-nowrap">₹{day.amount}</div>
                        <motion.div initial={{ height: 0 }} animate={{ height: `${day.height}%` }} className={`w-full max-w-[50px] rounded-t-xl transition-all duration-500 ${day.amount > 0 ? 'bg-gradient-to-t from-emerald-700 to-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)]' : 'bg-white/5'}`} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${day.amount > 0 ? 'text-emerald-400' : 'text-gray-600'}`}>{day.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
               <StatCard icon={<IndianRupee size={20}/>} label="Total Earnings" value={`₹${totalEarnings}`} color="text-emerald-400" />
               <StatCard icon={<Zap size={20}/>} label="Status" value={isOnline ? "Online" : "Offline"} color={isOnline ? "text-emerald-400" : "text-rose-500"} />
               <StatCard icon={<Clock4 size={20}/>} label="Upcoming" value={confirmedJobs.length} color="text-orange-400" />
            </div>
          </div>
        )}

        {/* --- CUSTOMER SEARCH VIEW --- */}
        {role === 'Customer' && activeTab === 'search' && (
          <>
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <StatCard icon={<Briefcase size={20}/>} label="Experts" value="Active" color="text-emerald-400" />
                <StatCard icon={<Star size={20}/>} label="Avg Rating" value="4.9" color="text-yellow-500" />
                <StatCard icon={<CheckCircle2 size={20}/>} label="Jobs Done" value={customerBookings.filter(b => b.status === 'completed').length} color="text-emerald-400" />
                <StatCard icon={<Clock4 size={20}/>} label="Pending" value={customerBookings.filter(b => b.status === 'pending').length} color="text-orange-400" />
            </motion.div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-10">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={24} />
                <input type="text" placeholder="Search service providers..." className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-6 pl-16 pr-6 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-lg placeholder:text-gray-600 backdrop-blur-sm shadow-xl" onChange={(e) => fetchAllProviders(e.target.value)} />
              </div>
              <div className="relative min-w-[200px]">
                <ArrowUpDown className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-full bg-white/5 border border-white/10 rounded-[2rem] py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-bold appearance-none cursor-pointer backdrop-blur-sm shadow-xl"
                >
                  <option value="default" className="bg-[#0d1117]">Sort By: Default</option>
                  <option value="priceLow" className="bg-[#0d1117]">Price: Low to High</option>
                  <option value="priceHigh" className="bg-[#0d1117]">Price: High to Low</option>
                  <option value="rating" className="bg-[#0d1117]">Best Rated</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* --- FILTER BAR --- */}
        {role === 'Customer' && activeTab === 'bookings' && (
          <div className="flex flex-wrap items-center gap-3 mb-8 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-sm">
            <Filter size={18} className="text-gray-500 mr-2 ml-2" />
            {['all', 'pending', 'confirmed', 'completed', 'rejected'].map((f) => (
              <button key={f} onClick={() => setBookingFilter(f)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${bookingFilter === f ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>{f}</button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
            {role === 'Provider' ? (
                <ProviderView key="provider" bookings={data} onUpdateStatus={handleUpdateStatus} />
            ) : activeTab === 'search' ? (
                <CustomerView key="customer-search" providers={getSortedProviders()} onBookClick={(p) => { setSelectedProvider(p); setIsBookingOpen(true); }} />
            ) : (
                <MyBookingsView key="customer-bookings" bookings={customerBookings.filter(b => bookingFilter === 'all' ? true : b.status === bookingFilter)} onRateClick={(b) => { setSelectedBooking(b); setIsReviewOpen(true); }} />
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-sm shadow-inner flex items-center justify-between">
        <div>
            <div className="text-2xl font-black mb-1">{value}</div>
            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{label}</div>
        </div>
        <div className={`${color} bg-white/5 p-3 rounded-2xl`}>{icon}</div>
    </div>
);

const ProviderView = ({ bookings, onUpdateStatus }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {bookings.length > 0 ? bookings.map((item, i) => (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={item._id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all relative overflow-hidden shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-emerald-500/20 p-4 rounded-2xl text-emerald-400"><Calendar size={24}/></div>
          <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${item.status === 'confirmed' ? 'bg-emerald-600' : item.status === 'completed' ? 'bg-emerald-500' : item.status === 'rejected' ? 'bg-rose-600' : 'bg-orange-500'} shadow-lg`}>{item.status}</span>
        </div>
        <h3 className="text-2xl font-bold mb-1 tracking-tight">{item.customer?.firstName} {item.customer?.lastName}</h3>
        <p className="flex items-center gap-2 text-emerald-400 text-sm font-bold mb-6 truncate"><Phone size={14}/> {item.phoneNumber || "No Phone"}</p>
        <div className="space-y-4 mb-8 text-sm">
            <div className="bg-black/20 p-5 rounded-3xl border border-white/5 shadow-inner">
                <p className="text-gray-500 text-[10px] font-black uppercase mb-2 flex items-center gap-1"><MessageSquare size={14}/> Problem</p>
                <p className="text-gray-300 italic">{item.problemDescription || "No details."}</p>
            </div>
            <div className="bg-black/20 p-5 rounded-3xl border border-white/5 shadow-inner">
                <p className="text-gray-500 text-[10px] font-black uppercase mb-2 flex items-center gap-1"><MapPin size={14}/> Address</p>
                <p className="text-gray-300">{item.address || "No address."}</p>
            </div>
        </div>
        {item.status === 'pending' && (
            <div className="flex gap-3">
                <button onClick={() => onUpdateStatus(item._id, 'confirmed')} className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase hover:bg-emerald-500 transition-all shadow-xl">Accept</button>
                <button onClick={() => onUpdateStatus(item._id, 'rejected')} className="flex-1 bg-white/5 text-rose-500 py-4 rounded-2xl font-black text-xs uppercase border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">Reject</button>
            </div>
        )}
        {item.status === 'confirmed' && (
            <motion.button whileHover={{ scale: 1.02 }} onClick={() => onUpdateStatus(item._id, 'completed')} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-xs uppercase shadow-xl flex items-center justify-center gap-2 tracking-widest">
                <CheckCircle2 size={16}/> Finish Assignment
            </motion.button>
        )}
      </motion.div>
    )) : <EmptyState msg="No assignment requests found." />}
  </div>
);

const CustomerView = ({ providers, onBookClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {providers.length > 0 ? providers.map((p, i) => (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={p._id} className="bg-white/5 border border-white/10 p-7 rounded-[2.5rem] group hover:border-emerald-500/50 transition-all relative shadow-lg flex flex-col justify-between" >
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-violet-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl text-white transition-transform group-hover:scale-110"> {p.firstName[0]} </div>
            <div>
              <h4 className="font-bold text-xl leading-tight">{p.businessName}</h4>
              <p className="text-emerald-400 text-[10px] font-black uppercase mt-1 tracking-widest">{p.serviceType}</p>
            </div>
          </div>
          <div className="mb-6 px-1">
            <p className="text-gray-400 text-xs italic line-clamp-2 leading-relaxed"> {p.bio || "Experience top-tier professional services tailored to your needs."} </p>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {p.skills && p.skills.length > 0 ? (
              p.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="bg-emerald-500/10 text-emerald-300 text-[9px] px-2 py-1 rounded-lg border border-emerald-500/20 font-bold uppercase tracking-tight"> {skill} </span>
              ))
            ) : (
              <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Verified Expert</span>
            )}
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-8 px-2 bg-white/5 p-4 rounded-2xl shadow-inner border border-white/5">
              <div>
                <span className="text-gray-500 text-[10px] font-bold uppercase block mb-1">Fee</span>
                <span className="text-xl font-black flex items-center text-white"><IndianRupee size={16}/>{p.hourlyRate}</span>
              </div>
              <div className="text-right">
                  <span className="text-gray-500 text-[10px] font-bold uppercase block mb-1">Rating</span>
                  <span className="flex items-center gap-1 text-yellow-500 font-black text-lg">
                    <Star size={14} fill="currentColor"/> {p.averageRating ? p.averageRating.toFixed(1) : "New"}
                  </span>
                  <span className="text-[10px] text-gray-500 block">({p.totalReviews || 0})</span>
              </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onBookClick(p)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm uppercase shadow-xl transition-colors tracking-widest" > Book Now </motion.button>
        </div>
      </motion.div>
    )) : <EmptyState msg="No experts found." />}
  </div>
);

const MyBookingsView = ({ bookings, onRateClick }) => (
    <div className="space-y-4">
        {bookings.length > 0 ? bookings.map((b, i) => (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={b._id} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/10 backdrop-blur-sm shadow-lg">
                <div className="flex items-center gap-6">
                    <div className="bg-white/10 p-5 rounded-3xl text-emerald-400 shadow-inner"><Briefcase size={28}/></div>
                    <div>
                        <h4 className="text-xl font-bold">{b.provider?.businessName || "Provider"}</h4>
                        <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{b.provider?.serviceType}</p>
                        <div className="flex items-center gap-4 text-gray-500 text-xs font-black uppercase">
                            <span className="flex items-center gap-2"><Calendar size={14}/> {new Date(b.serviceDate).toDateString()}</span>
                            <span className="flex items-center gap-2"><Clock size={14}/> {b.startTime}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-black/20 p-5 px-8 rounded-[1.5rem] border border-white/5 shadow-inner text-right min-w-[140px]">
                      <span className="text-[10px] font-black text-gray-500 uppercase block mb-1 tracking-widest">Status</span>
                      <span className={`font-black uppercase text-[10px] tracking-widest ${b.status === 'pending' ? 'text-orange-400' : b.status === 'rejected' ? 'text-rose-500' : 'text-emerald-400'}`}>{b.status}</span>
                  </div>
                  {b.status === 'completed' && !b.isReviewed && (
                    <button onClick={() => onRateClick(b)} className="bg-yellow-500/10 text-yellow-500 p-4 px-6 rounded-2xl border border-yellow-500/20 hover:bg-yellow-500 hover:text-black transition-all flex items-center gap-2 font-black text-xs uppercase shadow-lg"><Award size={20}/> Rate Now</button>
                  )}
                  {b.status === 'completed' && b.isReviewed && (
                    <div className="bg-emerald-500/10 text-emerald-400 p-4 px-6 rounded-2xl border border-emerald-500/20 flex items-center gap-2 font-black text-[10px] uppercase cursor-default"><CheckCircle2 size={16}/> Feedback Sent</div>
                  )}
                </div>
            </motion.div>
        )) : <EmptyState msg="No requests found for this filter." />}
    </div>
);

const EmptyState = ({ msg }) => (
  <div className="col-span-full py-32 text-center bg-white/5 rounded-[3.5rem] border-2 border-dashed border-white/5 shadow-inner font-bold text-xl italic tracking-wide text-gray-600">{msg}</div>
);

export default Dashboard;
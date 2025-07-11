import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Chatbot from "./chatbot"; // [LANGKAH 1] Impor komponen chatbot

// --- Ikon-ikon ---
const UserIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const LogoutIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>;
const TargetIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a6 6 0 01-1.27 8.17m-4.57 0A6 6 0 015.63 7.18m5.96 5.19a6 6 0 01-3.56 3.56m0-8.74a6 6 0 018.74 0M12 21a9 9 0 110-18 9 9 0 010 18z" /></svg>;
const CalculatorIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-5.186 0-9.443 4.025-9.726 9.118A.75.75 0 003 12h18a.75.75 0 00.726-.632C21.443 6.275 17.186 2.25 12 2.25z" /></svg>;
const PlayIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" /></svg>;

// --- Komponen-komponen ---
const Navbar = ({ user }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const userInitial = user?.nama_lengkap ? user.nama_lengkap.charAt(0).toUpperCase() : 'U';
    return (
        <nav className="bg-gray-900/50 backdrop-blur-md shadow-lg fixed w-full top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <a href="/dashboard-user" className="font-bold text-xl text-white">Home<span className="text-blue-400">Fit</span></a>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            <a href="/dashboard-user" className="text-white bg-white/10 font-bold px-3 py-2 rounded-md text-sm">Dashboard</a>
                            <a href="/program" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Program Latihan</a>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition-colors focus:outline-none"
                                >
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${userInitial}&background=2563eb&color=fff&bold=true`} 
                                        className="w-10 h-10 rounded-full"
                                        alt="User Avatar"
                                    />
                                </button>
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-3 w-56 bg-gray-800/90 backdrop-blur-xl rounded-lg shadow-2xl z-50 border border-white/10 overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-white/10">
                                                <p className="font-semibold text-white truncate">{user?.nama_lengkap || 'User'}</p>
                                                <p className="text-sm text-gray-400 truncate">{user?.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <Link to="/profil" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/10" onClick={() => setIsDropdownOpen(false)}>
                                                    <UserIcon className="w-5 h-5"/> Profil Saya
                                                </Link>
                                            </div>
                                            <div className="py-1 border-t border-white/10">
                                                <a href="#" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-white/10">
                                                    <LogoutIcon className="w-5 h-5"/> Logout
                                                </a>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const LoadingScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-300">Memuat data Anda...</p>
    </div>
);

const WorkoutProgress = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProgress = async () => {
            const token = localStorage.getItem('token');
            if (!token) { setLoading(false); return; }
            try {
                const response = await axios.get('http://localhost:8000/api/user/progress', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProgress(response.data);
            } catch (error) {
                console.error("Gagal memuat progres latihan:", error);
                setProgress({ hasActiveProgram: false }); 
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, []);

    if (loading) {
        return (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 md:p-8 rounded-2xl shadow-lg animate-pulse">
                <div className="h-8 bg-gray-700/50 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-8"></div>
                <div className="h-20 bg-gray-700/50 rounded-2xl"></div>
            </div>
        );
    }

    if (!progress || !progress.hasActiveProgram) {
        return (
            <motion.div 
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-lg text-center"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
              <TargetIcon className="w-16 h-16 mx-auto text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Mulai Perjalanan Fitness Anda</h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">Anda belum memiliki program aktif. Pilih program latihan untuk memulai.</p>
              <button onClick={() => navigate('/program')} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                  Cari Program Latihan
              </button>
           </motion.div>
        );
    }

    const { programName, completedSessions, totalSessions, nextSession } = progress;
    const progressPercentage = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

    return (
        <motion.div
            className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 md:p-8 rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                <div>
                    <p className="text-sm text-blue-400 font-semibold">PROGRAM AKTIF ANDA</p>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white">{programName}</h3>
                </div>
            </div>
            <div className="mb-8">
                <div className="flex justify-between items-end mb-1">
                    <p className="text-sm text-gray-300">Progres Sesi</p>
                    <p className="text-lg font-bold text-white">{completedSessions} <span className="text-sm font-normal text-gray-400">/ {totalSessions} Selesai</span></p>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                    <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    />
                </div>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-2xl text-center">
                <p className="text-gray-300 mb-2">Sesi Berikutnya:</p>
                <h4 className="text-xl font-bold text-white mb-5">{nextSession.name}</h4>
                <button 
                    onClick={() => navigate(nextSession.path)} 
                    className="w-full max-w-xs mx-auto flex items-center justify-center gap-3 bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                    <PlayIcon />
                    Lanjutkan Latihan
                </button>
            </div>
        </motion.div>
    );
};


// --- Komponen Utama Dashboard ---
const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [greeting, setGreeting] = useState('');
    
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Selamat Pagi');
        else if (hour < 18) setGreeting('Selamat Siang');
        else setGreeting('Selamat Malam');

        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get('http://localhost:8000/api/user', { headers: { Authorization: `Bearer ${token}` } });
                setUser(userResponse.data);
            } catch (error) {
                console.error("Gagal mengambil data pengguna:", error);
                if(error.response?.status === 401) navigate('/login');
            } finally {
                setPageLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);
    
    if (pageLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <div className="absolute inset-x-0 top-0 h-[50vh] bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop')"}}></div>
            <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-transparent to-gray-900"></div>
            
            <div className="relative z-10">
                <Navbar user={user} />
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                    <header className="mb-12">
                        <motion.h1 initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.5}} className="text-4xl md:text-5xl font-extrabold tracking-tight">{greeting}, {user?.nama_lengkap || 'Pejuang Fitness'}!</motion.h1>
                        <motion.p initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.5, delay: 0.1}} className="mt-2 text-lg text-gray-300">Siap untuk menjadi lebih kuat hari ini? Mari kita mulai.</motion.p>
                    </header>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <motion.div 
                            initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.5, delay: 0.2}} 
                            onClick={() => navigate("/program")} 
                            className="group relative bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300 overflow-hidden cursor-pointer"
                        >
                            <TargetIcon className="h-12 w-12 mb-4 text-purple-400"/>
                            <h2 className="text-2xl font-bold mb-2">Program Latihan</h2>
                            <p className="opacity-80">Temukan program yang dirancang untuk mencapai tujuanmu.</p>
                        </motion.div>
                        
                        <motion.div 
                            initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.5, delay: 0.3}} 
                            onClick={() => navigate("/kalkulator-fat")} 
                            className="group relative bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform duration-300 overflow-hidden cursor-pointer"
                        >
                            <CalculatorIcon className="h-12 w-12 mb-4 text-green-400"/>
                            <h2 className="text-2xl font-bold mb-2">Kalkulator Lemak</h2>
                            <p className="opacity-80">Lacak persentase lemak tubuh Anda untuk memantau kemajuan.</p>
                        </motion.div>
                    </div>

                    <div>
                        <WorkoutProgress />
                    </div>

                </main>
            </div>
            
            {/* [LANGKAH 2] Render komponen Chatbot di sini dan berikan prop user */}
            <Chatbot user={user} />
        </div>
    );
};

export default UserDashboard;
// File: LatihanHariIni.js

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

// ICONS
const CheckCircleIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ForwardIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;

// NAVBAR
const Navbar = () => {
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

    return (
        <nav className="bg-gray-900/50 backdrop-blur-md shadow-lg fixed w-full top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <a href="/dashboard-user" className="font-bold text-xl text-white">Home<span className="text-blue-400">Fit</span></a>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            <a href="/dashboard-user" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
                            <a href="/program" className="text-white bg-white/10 font-bold px-3 py-2 rounded-md text-sm">Program Latihan</a>
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition-colors focus:outline-none" aria-label="User Menu">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-white/20">
                                        <Link to="/profil" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setIsDropdownOpen(false)}>Profil Saya</Link>
                                        <a href="#" onClick={() => { localStorage.removeItem('token'); window.location.href = '/auth/sign-in'; }} className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300">Logout</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

// COMPONENT: CircularProgress
const CircularProgress = ({ size, strokeWidth, percentage, color }) => {
    const viewBox = `0 0 ${size} ${size}`;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <svg width={size} height={size} viewBox={viewBox} className="-rotate-90">
            <circle className="text-gray-700" stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
            <circle className={color} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" fill="transparent" r={radius} cx={size / 2} cy={size / 2} style={{ strokeDasharray: circumference, strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }} />
        </svg>
    );
};

// COMPONENT: Selesai
const CompletionScreen = ({ sesi, onBackToDashboard }) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
        <CheckCircleIcon className="w-28 h-28 text-green-400 mb-6 animate-pulse" />
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
            Kerja Bagus!
        </h1>
        <p className="text-xl text-gray-300 mt-3">
            Anda telah menyelesaikan sesi "{sesi?.nama_sesi}".
        </p>
        <button onClick={onBackToDashboard} className="mt-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
            Kembali ke Dashboard
        </button>
    </div>
);

// MAIN COMPONENT
const LatihanHariIni = () => {
    const { programId, sesiId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [sesi, setSesi] = useState(null);
    const [latihanList, setLatihanList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selesaiLatihan, setSelesaiLatihan] = useState(new Set());
    const [semuaSelesai, setSemuaSelesai] = useState(false);
    const [timer, setTimer] = useState(0);
    const [initialDuration, setInitialDuration] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [restTimer, setRestTimer] = useState(15);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = 'http://localhost:8000/api';

    useEffect(() => {
        const fetchSesiDetails = async () => {
            if (!sesiId || !token) {
                navigate('/login');
                return;
            }
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/sesi-latihan/${sesiId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSesi(response.data);
                const details = response.data.detail_latihans || [];
                setLatihanList(details);

                if (details.length > 0) {
                    const firstDuration = details[0].durasi || 0;
                    setTimer(firstDuration);
                    setInitialDuration(firstDuration);
                }
            } catch (err) {
                setError('Gagal memuat data sesi latihan.');
            } finally {
                setLoading(false);
            }
        };
        fetchSesiDetails();
    }, [sesiId, token, navigate]);

    useEffect(() => {
        let interval;
        if (isResting && restTimer > 0) {
            interval = setInterval(() => setRestTimer(prev => prev - 1), 1000);
        } else if (isResting && restTimer === 0) {
            setIsResting(false);
            goToNextExercise();
        }
        return () => clearInterval(interval);
    }, [isResting, restTimer]);

    const handleSelesai = async (detailId) => {
        try {
            await axios.post(`${API_URL}/progress/update`, {
                program_latihan_id: programId,
                sesi_latihan_id: sesiId,
                status: (currentIndex === latihanList.length - 1) ? 'selesai' : 'sedang_berjalan'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSelesaiLatihan(prev => new Set(prev).add(detailId));
            startRestOrFinish();
        } catch (err) {
            console.error("Gagal menyimpan progres:", err);
            alert("Gagal menyimpan progres Anda.");
        }
    };

    const startRestOrFinish = () => {
        if (currentIndex < latihanList.length - 1) {
            setIsResting(true);
        } else {
            setSemuaSelesai(true);
        }
    };

    const goToNextExercise = () => {
        if (currentIndex < latihanList.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            const nextDuration = latihanList[nextIndex].durasi || 0;
            setTimer(nextDuration);
            setInitialDuration(nextDuration);
            setRestTimer(15);
        } else {
            setSemuaSelesai(true);
        }
    };

    const getImageUrl = (fotoData) => {
        let fotoArray = [];
        if (typeof fotoData === 'string' && fotoData.startsWith('[')) {
            try {
                fotoArray = JSON.parse(fotoData);
            } catch (e) {}
        } else if (Array.isArray(fotoData)) {
            fotoArray = fotoData;
        }

        if (fotoArray.length > 0) {
            const path = fotoArray[0];
            return path.startsWith('http') ? path : `http://localhost:8000/storage/${path}`;
        }
        return 'https://placehold.co/800x450/111827/4f46e5?text=Latihan';
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Memuat...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">{error}</div>;
    if (semuaSelesai) return <CompletionScreen sesi={sesi} onBackToDashboard={() => navigate('/dashboard-user')} />;

    const currentLatihan = latihanList[currentIndex];

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <Navbar />
            <main className="container mx-auto px-4 pt-24 pb-12">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold">{sesi?.nama_sesi}</h1>
                    <p className="text-lg text-gray-400">Latihan {currentIndex + 1} dari {latihanList.length}</p>
                </div>

                {isResting ? (
                    <div className="text-center flex flex-col items-center justify-center p-8 bg-black/20 rounded-2xl shadow-lg border border-white/10" style={{ minHeight: '60vh' }}>
                        <h2 className="text-3xl font-bold text-gray-300">ISTIRAHAT</h2>
                        <div className="my-8 relative">
                            <CircularProgress size={200} strokeWidth={15} percentage={(restTimer / 15) * 100} color="text-teal-400" />
                            <span className="absolute inset-0 flex items-center justify-center text-6xl font-mono">{restTimer}</span>
                        </div>
                        <p className="text-xl text-gray-400">Latihan berikutnya:</p>
                        <p className="text-2xl font-bold text-white mt-1">{latihanList[currentIndex + 1]?.nama_detail}</p>
                        <button onClick={() => { setIsResting(false); goToNextExercise(); }} className="mt-8 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                            Lewati Istirahat
                        </button>
                    </div>
                ) : currentLatihan ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 bg-white/5 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-lg border border-white/10">
                            <div className="aspect-w-16 aspect-h-9 mb-6">
                                <img src={getImageUrl(currentLatihan.foto)} alt={currentLatihan.nama_detail} className="w-full h-full object-cover rounded-lg bg-gray-700" />
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold">{currentLatihan.nama_detail}</h2>
                            {currentLatihan.repetisi && <span className="text-5xl font-bold text-blue-400 mt-6 block">{currentLatihan.repetisi} <span className="text-3xl text-gray-300">Repetisi</span></span>}
                            {currentLatihan.durasi > 0 && (
                                <div className="mt-6">
                                    <CircularProgress size={120} strokeWidth={10} percentage={(timer / initialDuration) * 100} color="text-amber-400" />
                                    <div className="text-center -mt-20">
                                        <span className="text-4xl font-mono">{timer}</span>
                                        <span className="text-sm text-gray-400 block">detik</span>
                                    </div>
                                </div>
                            )}
                            {currentLatihan.note && <p className="mt-6 text-gray-300 bg-white/5 p-4 rounded-md border border-white/10">{currentLatihan.note}</p>}

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onClick={() => handleSelesai(currentLatihan.id)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                                    <CheckCircleIcon className="w-7 h-7" /> Selesai
                                </button>
                                <button onClick={startRestOrFinish} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    Lewati <ForwardIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10">
                            <h3 className="text-xl font-bold mb-4">Daftar Latihan</h3>
                            <ul className="space-y-3">
                                {latihanList.map((item, index) => (
                                    <li key={item.id} className={`p-4 rounded-lg transition-all duration-300 flex items-center justify-between ${index === currentIndex ? 'bg-blue-500/80 shadow-blue-500/30 shadow-md scale-105' : 'bg-white/10 hover:bg-white/20'}`}>
                                        <span className={`font-medium ${index === currentIndex ? 'text-white' : 'text-gray-300'}`}>{item.nama_detail}</span>
                                        {selesaiLatihan.has(item.id) && <CheckCircleIcon className="w-6 h-6 text-green-300" />}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : <div className="text-center bg-gray-800 p-8 rounded-lg"><p>Tidak ada latihan dalam sesi ini.</p></div>}
            </main>
        </div>
    );
};

export default LatihanHariIni;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

// --- Helper Components & Icons ---
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
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition-colors focus:outline-none"
                                    aria-label="User Menu"
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-white/20">
                                        <Link to="/profil" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" onClick={() => setIsDropdownOpen(false)}>Profil Saya</Link>
                                        <a href="#" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300">Logout</a>
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
const CheckBadgeIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12c0 .377-.042.748-.124 1.114A4.49 4.49 0 0118 15.75c-1.357 0-2.573-.6-3.397-1.549a4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-.377.042-.748.124-1.114A4.49 4.49 0 016 8.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0118 15.75c.377 0 .748.042 1.114.124a4.49 4.49 0 012.43 4.218c-.135.082-.273.16-.414.231a.5.5 0 01-.624-.312l-1.32-3.155a.5.5 0 01.311-.624l1.792-.746a.5.5 0 01.579.088l.55.55a.5.5 0 010 .707l-2.828 2.828a.5.5 0 01-.707 0l-1.768-1.768a.5.5 0 01.707-.707l.55.55a.5.5 0 01.707 0l1.177 1.177c.07.07.164.12.26.155l-1.06 2.545a.5.5 0 01-.624.312l-1.792-.746a.5.5 0 01-.579.088l-.55.55a.5.5 0 01-.707 0l-2.828-2.828a.5.5 0 010-.707l1.768-1.768a.5.5 0 01.707.707l-.55.55a.5.5 0 01-.707 0L9.94 15.06a.5.5 0 01-.312-.624l1.32-3.155a.5.5 0 01.624-.312l1.792.746a.5.5 0 01.579-.088l.55-.55a.5.5 0 01.707 0z" clipRule="evenodd" /></svg>;
const ExclamationTriangleIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;


const RekomendasiSesiPage = () => {
    const { programId } = useParams();
    const navigate = useNavigate();
    const [rekomendasiList, setRekomendasiList] = useState([]);
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = 'http://localhost:8000/api';
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRekomendasi = async () => {
            if (!programId || !token) {
                navigate('/login');
                return;
            }
            try {
                setLoading(true);
                const programRes = await axios.get(`${API_URL}/program-latihan/${programId}`, { headers: { Authorization: `Bearer ${token}` } });
                setProgram(programRes.data);

                const rekomendasiRes = await axios.post(`${API_URL}/rekomendasi/sesi`, { program_latihan_id: programId }, { headers: { Authorization: `Bearer ${token}` } });
                
                if (Array.isArray(rekomendasiRes.data)) {
                    setRekomendasiList(rekomendasiRes.data);
                } else {
                    setRekomendasiList([]);
                    console.warn("API response is not an array:", rekomendasiRes.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Gagal mendapatkan rekomendasi.');
                setRekomendasiList([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRekomendasi();
    }, [programId, token, navigate]);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <div className="absolute inset-x-0 top-0 h-[400px] bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${program?.foto})` }}></div>
            <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-transparent to-gray-900"></div>

            <div className="relative z-10">
                <Navbar />
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                    <header className="mb-12">
                        <button onClick={() => navigate(-1)} className="text-blue-400 hover:text-blue-300 mb-4 font-semibold">&larr; Kembali Pilih Program</button>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Rekomendasi Sesi untuk Anda
                        </h1>
                        <p className="mt-3 max-w-2xl text-lg text-gray-300">
                            Berdasarkan profil Anda, berikut adalah sesi latihan dari program <span className="font-bold text-white">"{program?.nama}"</span> yang kami sarankan.
                        </p>
                    </header>

                    {loading ? <p className="text-center text-gray-400">Menganalisis profil Anda...</p> : 
                     error ? <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p> :
                     (
                         <div className="space-y-6">
                             {rekomendasiList.length > 0 ? (
                                 rekomendasiList.map(sesi => (
                                     <div key={sesi.id} className={`bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border-l-4 ${sesi.rekomendasi ? 'border-green-500' : 'border-amber-500'} p-6 transition-all hover:bg-white/10`}>
                                         <div className="flex flex-col md:flex-row items-center gap-6">
                                             <div className="flex-grow text-center md:text-left">
                                                 <h3 className="text-2xl font-bold text-white">{sesi.nama_sesi}</h3>
                                                 <div className={`flex items-start gap-3 mt-2 text-sm p-3 rounded-md ${sesi.rekomendasi ? 'bg-green-500/10 text-green-300' : 'bg-amber-500/10 text-amber-300'}`}>
                                                     {sesi.rekomendasi ? 
                                                         <CheckBadgeIcon className="w-6 h-6 mt-0.5 flex-shrink-0 text-green-400"/> : 
                                                         <ExclamationTriangleIcon className="w-6 h-6 mt-0.5 flex-shrink-0 text-amber-400"/>
                                                     }
                                                     <p>{sesi.catatan}</p>
                                                 </div>
                                             </div>
                                             
                                             <div className="w-full md:w-auto flex-shrink-0">
                                                {sesi.is_completed ? (
                                                    // ===================================================================
                                                    // PERBAIKAN: Mengubah 'div' menjadi 'button' yang bisa diklik
                                                    // ===================================================================
                                                    <button
                                                        onClick={() => navigate(`/program/${programId}/sesi/${sesi.id}`)}
                                                        className="flex items-center justify-center gap-2 w-full md:w-auto bg-green-500/20 text-green-300 font-semibold py-3 px-6 rounded-lg transition-colors hover:bg-green-500/30"
                                                    >
                                                        <CheckCircleIcon className="w-6 h-6" />
                                                        Lihat Sesi
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => navigate(`/program/${programId}/sesi/${sesi.id}`)}
                                                        disabled={!sesi.rekomendasi}
                                                        className="w-full md:w-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                                                    >
                                                        Mulai Sesi
                                                    </button>
                                                )}
                                             </div>
                                         </div>
                                     </div>
                                 ))
                             ) : (
                                 <div className="text-center py-16 bg-white/5 rounded-lg">
                                     <p className="text-gray-400">Tidak ada sesi latihan untuk program ini.</p>
                                 </div>
                             )}
                         </div>
                       )
                    }
                </main>
            </div>
        </div>
    );
};

export default RekomendasiSesiPage;

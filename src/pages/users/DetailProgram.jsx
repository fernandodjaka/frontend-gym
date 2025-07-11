import React, { useState, useEffect, useCallback, useRef } from 'react';
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


const DetailProgram = () => {
    const { programId } = useParams();
    const navigate = useNavigate();
    const [program, setProgram] = useState(null);
    const [sesiList, setSesiList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = 'http://localhost:8000/api';
    const BASE_URL = 'http://localhost:8000/storage/';
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            if (!programId || !token) {
                navigate('/login');
                return;
            }
            try {
                setLoading(true);
                const programRes = await axios.get(`${API_URL}/program-latihan/${programId}`, { headers: { Authorization: `Bearer ${token}` } });
                setProgram(programRes.data);

                const sesiRes = await axios.get(`${API_URL}/sesi-latihan?program_latihan_id=${programId}`, { headers: { Authorization: `Bearer ${token}` } });
                
                const sesiWithDetails = await Promise.all(
                    sesiRes.data.map(async (sesi) => {
                        const detailRes = await axios.get(`${API_URL}/detail-latihan?sesi_latihan_id=${sesi.id}`, { headers: { Authorization: `Bearer ${token}` } });
                        sesi.detail_latihans = detailRes.data;
                        return sesi;
                    })
                );
                setSesiList(sesiWithDetails);
            } catch (err) {
                setError('Gagal memuat detail program.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [programId, token, navigate]);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <div className="absolute inset-x-0 top-0 h-[500px] bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${BASE_URL}${program?.foto})`}}></div>
            <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-transparent to-gray-900"></div>

            <div className="relative z-10">
                <Navbar />
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                    <header className="mb-12">
                        <button onClick={() => navigate(-1)} className="text-blue-400 hover:text-blue-300 mb-4 font-semibold">&larr; Kembali</button>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            {program ? program.nama : "Memuat..."}
                        </h1>
                        <p className="mt-3 max-w-2xl text-lg text-gray-300">
                            Berikut adalah ringkasan lengkap dari semua sesi dan latihan dalam program ini.
                        </p>
                    </header>

                    {loading ? <p className="text-center text-gray-400">Memuat detail program...</p> : 
                     error ? <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p> :
                     (
                        <div className="space-y-12">
                            {sesiList.length > 0 ? sesiList.map((sesi) => (
                                <div key={sesi.id} className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/10">
                                    <h2 className="text-3xl font-bold text-white border-b-2 border-white/20 pb-3 mb-6">
                                        {sesi.nama_sesi}
                                    </h2>
                                    <div className="space-y-4">
                                        {sesi.detail_latihans && sesi.detail_latihans.length > 0 ? sesi.detail_latihans.map(detail => (
                                            <div key={detail.id} className="flex items-start gap-4 p-4 rounded-lg bg-white/5">
                                                {detail.foto && JSON.parse(detail.foto).length > 0 ? (
                                                    <img src={`${BASE_URL}${JSON.parse(detail.foto)[0]}`} alt={detail.nama_detail} className="w-24 h-24 object-cover rounded-md flex-shrink-0"/>
                                                ) : (
                                                    <div className="w-24 h-24 bg-gray-700 rounded-md flex-shrink-0"></div>
                                                )}
                                                <div>
                                                    <h4 className="font-bold text-lg text-gray-100">{detail.nama_detail}</h4>
                                                    <p className="text-gray-300 text-sm">
                                                        {detail.repetisi ? `${detail.repetisi} Repetisi` : `${detail.durasi} Detik`}
                                                    </p>
                                                    {detail.note && <p className="text-xs text-gray-400 mt-1">{detail.note}</p>}
                                                </div>
                                            </div>
                                        )) : <p className="text-gray-400">Tidak ada latihan detail untuk sesi ini.</p>}
                                    </div>
                                </div>
                            )) : (
                                 <div className="text-center py-16 bg-white/5 rounded-lg">
                                    <p className="text-gray-400 text-lg">Program ini belum memiliki sesi latihan.</p>
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

export default DetailProgram;

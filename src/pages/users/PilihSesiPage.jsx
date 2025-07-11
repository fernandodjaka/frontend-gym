import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

// --- Helper Components & Icons ---
const Navbar = () => (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0">
                    <a href="/dashboard-user" className="font-bold text-xl text-gray-800">Home<span className="text-blue-600">Fit</span></a>
                </div>
                <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                        <a href="/dashboard-user" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
                        <a href="/program" className="text-blue-600 font-bold px-3 py-2 rounded-md text-sm">Program Latihan</a>
                        <a href="#" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Logout</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
);

const PlayIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>;


const PilihSesiPage = () => {
    const [program, setProgram] = useState(null);
    const [sesiList, setSesiList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { programId } = useParams();
    const navigate = useNavigate();

    const API_URL = 'http://localhost:8000/api';
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            if (!programId || !token) {
                navigate('/login');
                return;
            }
            try {
                setLoading(true);
                // 1. Ambil detail program untuk mendapatkan nama programnya
                const programRes = await axios.get(`${API_URL}/program-latihan/${programId}`, { headers: { Authorization: `Bearer ${token}` } });
                setProgram(programRes.data);

                // 2. Ambil semua sesi yang terkait dengan programId ini
                const sesiRes = await axios.get(`${API_URL}/sesi-latihan?program_latihan_id=${programId}`, { headers: { Authorization: `Bearer ${token}` } });
                setSesiList(sesiRes.data);

            } catch (err) {
                setError('Gagal memuat data sesi latihan.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [programId, token, navigate]);

    // Navigasi ke halaman latihan dengan membawa ID program dan sesi
    // Anda mungkin perlu menyesuaikan halaman LatihanHariIni untuk menerima sesiId
    const handleStartSession = (sesiId) => {
        navigate(`/program/latihan/${programId}/sesi/${sesiId}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <header className="mb-12">
                    <button onClick={() => navigate(`/program`)} className="text-blue-600 hover:text-blue-800 mb-4 font-semibold">&larr; Kembali ke Daftar Program</button>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
                        {program ? program.nama : "Memuat Program..."}
                    </h1>
                    <p className="mt-3 max-w-2xl text-lg text-gray-500">
                        Pilih sesi latihan di bawah ini untuk memulai hari ini.
                    </p>
                </header>

                {loading ? (
                    <p className="text-center text-gray-600">Memuat sesi latihan...</p>
                ) : error ? (
                    <p className="text-center text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>
                ) : (
                    <div className="space-y-6">
                        {sesiList.length > 0 ? sesiList.map((sesi, index) => (
                            <div
                                key={sesi.id}
                                className="group bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col md:flex-row items-center gap-6 transform hover:scale-105 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-xl font-bold text-2xl">
                                    {sesi.urutan > 0 ? `H${sesi.urutan}` : index + 1}
                                </div>
                                <div className="flex-grow text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-gray-800">{sesi.nama_sesi}</h3>
                                    <p className="text-gray-500 mt-1">{sesi.deskripsi || 'Selesaikan semua latihan dalam sesi ini.'}</p>
                                </div>
                                <button
                                    onClick={() => handleStartSession(sesi.id)}
                                    className="w-full md:w-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <PlayIcon className="w-5 h-5"/>
                                    Mulai Sesi
                                </button>
                            </div>
                        )) : (
                             <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-white rounded-lg shadow-md">
                                <p className="text-gray-500 text-lg">Belum ada sesi latihan untuk program ini.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default PilihSesiPage;

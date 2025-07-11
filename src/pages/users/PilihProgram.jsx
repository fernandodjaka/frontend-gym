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

const PilihProgram = () => {
  const [programList, setProgramList] = useState([]);
  const [tujuan, setTujuan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { tujuanId } = useParams();
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!tujuanId || !token) {
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const tujuanResponse = await axios.get(`${API_URL}/api/tujuan-latihan/${tujuanId}`, { headers: { Authorization: `Bearer ${token}` } });
        setTujuan(tujuanResponse.data);

        const programResponse = await axios.get(`${API_URL}/api/program-latihan?tujuan_id=${tujuanId}`, { headers: { Authorization: `Bearer ${token}` } });
        setProgramList(programResponse.data);
        setError('');
      } catch (err) {
        setError('Gagal memuat data program latihan. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, [tujuanId, token, navigate]);

  const handlePilihProgram = (programId) => {
    navigate(`/program/${programId}/rekomendasi`);
  };

  const getImageUrl = (fotoPath) => {
    if (!fotoPath) {
        return `https://placehold.co/600x800/111827/4f46e5?text=No+Image`;
    }
    if (fotoPath.startsWith('http')) {
        return fotoPath;
    }
    return `${API_URL}/storage/${fotoPath}`;
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-400">Memuat program...</p>;
    }
    if (error) {
      return <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p>;
    }
    if (programList.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programList.map((program) => (
            <div
              key={program.id}
              onClick={() => handlePilihProgram(program.id)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 bg-white/5 backdrop-blur-lg border border-white/10"
            >
              <img
                src={getImageUrl(program.foto)}
                alt={program.nama}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-3xl font-bold">{program.nama}</h3>
                  <p className="mt-1 text-gray-300">Program {tujuan?.nama}</p>
                  <div className="mt-4 text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-2">
                      Lihat Rekomendasi &rarr;
                  </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="text-center py-16 bg-white/5 rounded-lg">
          <p className="text-gray-400">Belum ada program untuk tujuan ini.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="absolute inset-x-0 top-0 h-[400px] bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581009137042-c552e485697a?q=80&w=2070&auto=format&fit=crop')"}}></div>
      <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-transparent to-gray-900"></div>
      
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <header className="text-center mb-12">
            <button onClick={() => navigate('/program')} className="text-blue-400 hover:text-blue-300 mb-4 font-semibold">&larr; Kembali Pilih Tujuan</button>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Program untuk: <span className="text-blue-400">{tujuan?.nama || '...'}</span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-300">
              Pilih program di bawah ini untuk mendapatkan rekomendasi sesi latihan yang dipersonalisasi.
            </p>
          </header>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default PilihProgram;

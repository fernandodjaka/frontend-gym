import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// --- Komponen Navbar dan Gauge tetap sama ---
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
                            <a href="/program" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Program Latihan</a>
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
const Gauge = ({ value, label, unit, colorClass }) => {
    const gaugeMaxValue = 50;
    const percentage = Math.min(Math.max(value, 0), gaugeMaxValue);
    const rotation = (percentage / gaugeMaxValue) * 180;
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-48 h-24 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-700 rounded-t-full border-b-0"></div>
                <div 
                    className={`absolute top-0 left-0 w-full h-full border-8 ${colorClass} rounded-t-full border-b-0 transition-transform duration-500 ease-in-out`} 
                    style={{ 
                        transform: `rotate(${rotation}deg)`, 
                        transformOrigin: 'bottom center',
                        clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'
                    }}
                ></div>
                <div className="absolute inset-0 flex items-end justify-center">
                    <div className="bg-gray-900 w-[176px] h-[88px] rounded-t-full" style={{bottom: '0px'}}></div>
                </div>
            </div>
            <div className="-mt-16 text-center z-10">
                <p className="text-4xl font-bold">{value.toFixed(1)}<span className="text-2xl text-gray-400">{unit}</span></p>
                <p className="text-sm text-gray-400">{label}</p>
            </div>
        </div>
    );
};

const BodyFatCalculator = () => {
    const [berat, setBerat] = useState("");
    const [tinggi, setTinggi] = useState("");
    const [usia, setUsia] = useState("");
    const [jenisKelamin, setJenisKelamin] = useState("pria");
    const [hasil, setHasil] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const hitung = () => {
        const beratNum = parseFloat(berat);
        const tinggiM = parseFloat(tinggi) / 100;
        const usiaNum = parseInt(usia);
        const genderMultiplier = jenisKelamin === "pria" ? 1 : 0;

        if (!beratNum || !tinggiM || !usiaNum || beratNum <= 0 || tinggiM <= 0 || usiaNum <= 0) {
            setError("Mohon lengkapi semua input dengan angka positif yang valid.");
            setHasil(null);
            return;
        }
        setError("");

        const bmi = beratNum / (tinggiM * tinggiM);
        const fat = (1.20 * bmi) + (0.23 * usiaNum) - (10.8 * genderMultiplier) - 5.4;

        let kategori = "", colorClass = "", saran = "";
        let rekomendasiLink = "/program";
        let rekomendasiTeks = "Lihat Semua Program";

        if (jenisKelamin === "pria") {
            if (fat < 6) { 
                kategori = "Sangat Rendah"; colorClass="text-blue-400"; 
                saran = "Kadar lemak Anda sangat rendah. Pastikan asupan nutrisi cukup. Pertimbangkan untuk menambah massa otot.";
                // [PERBAIKAN] Mengubah URL agar sesuai dengan App.js
                rekomendasiLink = "/program/1"; // Asumsi ID 1 = Bulking
                rekomendasiTeks = "Cari Program Penambah Massa Otot";
            } else if (fat < 18) { 
                kategori = "Ideal"; colorClass="text-green-400"; 
                saran = "Kerja bagus! Kadar lemak Anda ideal. Pertahankan gaya hidup sehat dengan olahraga teratur.";
                // [PERBAIKAN] Mengubah URL agar sesuai dengan App.js
                rekomendasiLink = "/program/3"; // Asumsi ID 3 = General Fitness
                rekomendasiTeks = "Jelajahi Program Kebugaran";
            } else { // Tinggi atau Sangat Tinggi
                kategori = fat < 25 ? "Tinggi" : "Sangat Tinggi";
                colorClass = fat < 25 ? "text-yellow-400" : "text-red-400";
                saran = fat < 25 ? "Kadar lemak Anda sedikit di atas normal. Fokus pada latihan kardio dan perbaiki pola makan." : "Kadar lemak Anda sangat tinggi. Mulai program penurunan berat badan dengan diet dan olahraga.";
                // [PERBAIKAN] Mengubah URL agar sesuai dengan App.js
                rekomendasiLink = "/program/2"; // Asumsi ID 2 = Cutting
                rekomendasiTeks = "Cari Program Penurunan Lemak";
            }
        } else { // Wanita
            if (fat < 14) { 
                kategori = "Sangat Rendah"; colorClass="text-blue-400"; 
                saran = "Kadar lemak Anda sangat rendah. Ini bisa memengaruhi siklus hormonal. Pastikan asupan gizi seimbang.";
                // [PERBAIKAN] Mengubah URL agar sesuai dengan App.js
                rekomendasiLink = "/program/1"; // Asumsi ID 1 = Bulking
                rekomendasiTeks = "Cari Program Penambah Massa Otot";
            } else if (fat < 25) { 
                kategori = "Ideal"; colorClass="text-green-400"; 
                saran = "Luar biasa! Anda berada di rentang ideal. Terus jaga pola hidup sehat Anda.";
                // [PERBAIKAN] Mengubah URL agar sesuai dengan App.js
                rekomendasiLink = "/program/3"; // Asumsi ID 3 = General Fitness
                rekomendasiTeks = "Jelajahi Program Kebugaran";
            } else { // Tinggi atau Sangat Tinggi
                kategori = fat < 32 ? "Tinggi" : "Sangat Tinggi";
                colorClass = fat < 32 ? "text-yellow-400" : "text-red-400";
                saran = fat < 32 ? "Kadar lemak Anda sedikit tinggi. Tingkatkan aktivitas fisik, terutama kardio, dan kurangi makanan olahan." : "Kadar lemak Anda jauh di atas rentang sehat. Prioritaskan perubahan gaya hidup. Sebaiknya konsultasi dengan profesional.";
                // [PERBAIKAN] Mengubah URL agar sesuai dengan App.js
                rekomendasiLink = "/program/2"; // Asumsi ID 2 = Cutting
                rekomendasiTeks = "Cari Program Penurunan Lemak";
            }
        }

        setHasil({ bmi, fat, kategori, colorClass, saran, rekomendasiLink, rekomendasiTeks });
    };
    
    const inputClasses = "w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition";
    const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <div className="mb-8">
                    <button 
                        onClick={() => navigate('/dashboard-user')}
                        className="flex items-center gap-2 bg-transparent text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-white/10 transition-colors duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                        Kembali ke Dashboard
                    </button>
                </div>

                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Kalkulator Kadar Lemak Tubuh</h1>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-300">
                        Dapatkan estimasi persentase lemak tubuh Anda untuk membantu merancang program latihan yang lebih efektif.
                    </p>
                </header>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Form Input */}
                    <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/10">
                        <h2 className="text-2xl font-bold mb-6">Masukkan Data Anda</h2>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="berat" className={labelClasses}>Berat Badan (kg)</label>
                                <input id="berat" type="number" value={berat} onChange={(e) => setBerat(e.target.value)} className={inputClasses} placeholder="Contoh: 70" />
                            </div>
                            <div>
                                <label htmlFor="tinggi" className={labelClasses}>Tinggi Badan (cm)</label>
                                <input id="tinggi" type="number" value={tinggi} onChange={(e) => setTinggi(e.target.value)} className={inputClasses} placeholder="Contoh: 175" />
                            </div>
                            <div>
                                <label htmlFor="usia" className={labelClasses}>Usia</label>
                                <input id="usia" type="number" value={usia} onChange={(e) => setUsia(e.target.value)} className={inputClasses} placeholder="Contoh: 25" />
                            </div>
                            <div>
                                <label htmlFor="jenisKelamin" className={labelClasses}>Jenis Kelamin</label>
                                <select id="jenisKelamin" value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)} className={inputClasses}>
                                    <option value="pria">Pria</option>
                                    <option value="wanita">Wanita</option>
                                </select>
                            </div>
                            <button onClick={hitung} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg">
                                Hitung Sekarang
                            </button>
                        </div>
                    </div>

                    {/* Hasil Kalkulasi */}
                    <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/10 min-h-[460px]">
                         <h2 className="text-2xl font-bold mb-8 text-center">Hasil Estimasi Anda</h2>
                         {error && <p className="text-center text-red-400 p-3 bg-red-900/50 rounded-lg">{error}</p>}
                         {hasil ? (
                             <div className="space-y-6">
                                 <div className="flex flex-col sm:flex-row justify-around items-center gap-4">
                                     <Gauge value={hasil.bmi} label="BMI" unit="" colorClass="text-purple-400" />
                                     <Gauge value={hasil.fat} label="Lemak Tubuh" unit="%" colorClass={hasil.colorClass} />
                                 </div>
                                 <div className="text-center p-4 rounded-lg bg-white/10">
                                     <p className="text-gray-300">Kategori Lemak Tubuh Anda</p>
                                     <p className={`text-3xl font-bold ${hasil.colorClass}`}>{hasil.kategori}</p>
                                 </div>
                                 <div className="p-4 bg-gray-800/50 border border-white/10 rounded-lg">
                                     <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                         Saran Untuk Anda
                                     </h3>
                                     <p className="text-gray-300 text-sm">{hasil.saran}</p>
                                 </div>
                                 <div className="mt-4">
                                     <button 
                                        onClick={() => navigate(hasil.rekomendasiLink)}
                                        className="w-full flex items-center justify-center gap-3 bg-green-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
                                     >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        {hasil.rekomendasiTeks}
                                     </button>
                                 </div>
                                 <p className="text-xs text-gray-400 text-center mt-2">
                                     <strong>Catatan:</strong> Ini hanya estimasi. Untuk hasil yang lebih akurat, konsultasikan dengan profesional.
                                 </p>
                             </div>
                         ) : (
                             <div className="text-center py-16 text-gray-400 flex flex-col items-center justify-center h-full">
                                 <p>Hasil akan ditampilkan di sini setelah Anda mengisi data dan menekan tombol hitung.</p>
                             </div>
                         )}
                     </div>
                </div>
            </main>
        </div>
    );
};

export default BodyFatCalculator;
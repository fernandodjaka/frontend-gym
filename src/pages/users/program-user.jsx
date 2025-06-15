import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProgramUser = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/program-latihan', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        });
        setPrograms(res.data);
      } catch (err) {
        console.error('Gagal mengambil data:', err);
        setError('Gagal memuat data program latihan.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Program Latihan Anda
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Jelajahi program latihan yang tersedia untuk mencapai tujuan kebugaran Anda
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p className="text-gray-600">Memuat data program latihan...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg max-w-md mx-auto p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-900">Data tidak tersedia</h3>
            <p className="mt-2 text-gray-500">Silakan coba lagi nanti</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((item) => (
              <div key={item.id} className="group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-2">
                <div className="h-64 w-full overflow-hidden relative">
                  <img
                    src={`http://localhost:8000/storage/${item.foto}`}
                    alt={item.nama}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/fallback.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600">
                  <h3 className="text-2xl font-bold mb-2">{item.nama}</h3>
                  <p className="text-blue-100">{item.deskripsi || 'Latihan menyenangkan menanti Anda!'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramUser;

// src/pages/user/tujuan-user.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TujuanUser = () => {
  const [tujuanList, setTujuanList] = useState([]);
  const [selectedTujuan, setSelectedTujuan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchTujuanLatihan();
  }, []);

  const fetchTujuanLatihan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/tujuan-latihan', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setTujuanList(response.data);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTujuan = (id) => {
    setSelectedTujuan(id === selectedTujuan ? null : id);
    setShowSuccess(false);
  };

  const handleSubmit = async () => {
    if (!selectedTujuan) {
      alert('Silakan pilih tujuan latihan terlebih dahulu');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/pilih-tujuan',
        { tujuan_id: selectedTujuan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Gagal menyimpan tujuan:', error);
      alert('Gagal menyimpan tujuan latihan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-down">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Tujuan latihan berhasil disimpan!
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Pilih Tujuan Latihan Anda
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Temukan program yang sesuai dengan target kebugaran Anda
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p className="text-gray-600">Memuat data tujuan latihan...</p>
          </div>
        ) : 
        
        /* Empty State */
        tujuanList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg max-w-md mx-auto p-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-900">Data tidak tersedia</h3>
            <p className="mt-2 text-gray-500">Silakan coba lagi nanti</p>
            <button 
              onClick={fetchTujuanLatihan}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Muat Ulang
            </button>
          </div>
        ) : 
        
        /* Main Content */
        (
          <>
            {/* Tujuan Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {tujuanList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectTujuan(item.id)}
                  className={`relative cursor-pointer group rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ${
                    selectedTujuan === item.id
                      ? 'ring-4 ring-blue-500 ring-offset-4 transform scale-[1.02]'
                      : 'hover:shadow-2xl hover:-translate-y-2'
                  }`}
                >
                  {/* Card Image */}
                  {item.foto && (
                    <div className="h-64 w-full overflow-hidden relative">
                      <img
                        src={`http://localhost:8000/${item.foto}`}
                        alt={item.nama}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  )}
                  
                  {/* Card Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                    <h3 className="text-2xl font-bold mb-2">{item.nama}</h3>
                    <p className="text-blue-100">{item.deskripsi || 'Mulai perjalanan kebugaran Anda'}</p>
                    

                  </div>
                  
                  {/* Selection Checkmark */}
                  <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    selectedTujuan === item.id ? 'bg-blue-500 scale-100' : 'bg-white/80 scale-0 group-hover:scale-100'
                  }`}>
                    {selectedTujuan === item.id && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                </div>
              ))}
            </div>

            {/* Submit Button Section */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedTujuan}
                className={`relative px-10 py-4 rounded-full text-lg font-bold text-white transition-all duration-300 shadow-lg ${
                  selectedTujuan
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
                    : 'bg-gray-400 cursor-not-allowed'
                } overflow-hidden group`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      Simpan Pilihan
                      <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </span>
                <span className={`absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  selectedTujuan ? '' : 'hidden'
                }`}></span>
              </button>
              
              {/* Selected Indicator */}
              {selectedTujuan && !isSubmitting && (
                <p className="mt-4 text-gray-600">
                  Anda memilih: <span className="font-semibold text-blue-600">
                    {tujuanList.find(t => t.id === selectedTujuan)?.nama}
                  </span>
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TujuanUser;
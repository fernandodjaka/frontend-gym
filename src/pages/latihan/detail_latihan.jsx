import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- Helper Components & Icons (No external libraries) ---
const EditIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const DeleteIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const CloseIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

// <-- TAMBAHAN: Komponen Spinner visual menggunakan Tailwind CSS -->
const Spinner = () => (
    <div className="border-4 border-gray-200 border-t-blue-600 rounded-full w-10 h-10 animate-spin"></div>
);

const DetailLatihanAdminPage = () => {
    const [allDetails, setAllDetails] = useState([]);
    const [filteredDetails, setFilteredDetails] = useState([]);
    const [formData, setFormData] = useState({ foto: [] });
    const [sesiLatihans, setSesiLatihans] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    const API_URL = 'http://localhost:8000/api';
    const BASE_URL = "http://localhost:8000/storage/";
    const token = localStorage.getItem('token');

    // <-- MODIFIKASI: Menggabungkan kedua fungsi fetch untuk manajemen loading yang lebih baik -->
    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(''); // Reset error setiap kali fetch data baru
        try {
            // Menjalankan kedua permintaan API secara paralel
            const [detailsResponse, sesiResponse] = await Promise.all([
                axios.get(`${API_URL}/admin/detail-latihan`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/admin/sesi-latihan`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setAllDetails(detailsResponse.data);
            setFilteredDetails(detailsResponse.data);
            setSesiLatihans(sesiResponse.data);
        } catch (err) {
            setError('Gagal memuat data. Silakan refresh halaman.');
            console.error("Gagal memuat data:", err);
        } finally {
            setLoading(false); // Matikan loading setelah semua proses selesai
        }
    }, [token]);

    // Hanya untuk me-refresh data detail latihan setelah simpan/hapus tanpa me-refresh sesi
    const fetchDetailLatihansOnly = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/detail-latihan`, { headers: { Authorization: `Bearer ${token}` } });
            setAllDetails(response.data);
            setFilteredDetails(response.data);
        } catch (err) {
            setError('Gagal memperbarui data detail latihan.');
        }
    }, [token]);

    useEffect(() => {
        // Panggil fungsi gabungan saat komponen pertama kali dimuat
        fetchAllData();
    }, [fetchAllData]);

    useEffect(() => {
        const result = allDetails.filter(detail => 
            detail.nama_detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            detail.sesi_latihan?.nama_sesi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            detail.sesi_latihan?.program_latihan?.nama.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredDetails(result);
    }, [searchTerm, allDetails]);

    const openModal = (item = null) => {
        setIsEditing(!!item);
        setFormData(item ? { ...item, foto: [] } : { kategori: 'strength', foto: [] });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setFormData({ foto: [] });
        setError('');
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: files });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.sesi_latihan_id) {
            setError('Sesi Latihan wajib dipilih.');
            return;
        }

        const submissionData = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'foto') {
                if (formData.foto && formData.foto.length > 0) {
                    for (let i = 0; i < formData.foto.length; i++) {
                        submissionData.append('foto[]', formData.foto[i]);
                    }
                }
            } else if (formData[key] !== null && formData[key] !== undefined) {
                 submissionData.append(key, formData[key]);
            }
        });
        
        if (isEditing) {
            submissionData.append('_method', 'PUT');
        }

        const url = isEditing ? `${API_URL}/admin/detail-latihan/${formData.id}` : `${API_URL}/admin/detail-latihan`;
        
        try {
            await axios.post(url, submissionData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
            fetchDetailLatihansOnly(); // Cukup refresh detail latihan
            closeModal();
        } catch (err) {
            const errorData = err.response?.data;
            setError(errorData?.message || 'Terjadi kesalahan.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus detail ini?')) {
            try {
                await axios.delete(`${API_URL}/admin/detail-latihan/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchDetailLatihansOnly(); // Cukup refresh detail latihan
            } catch (err) {
                alert('Gagal menghapus data.');
            }
        }
    };

    const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="p-6 md:p-10">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Manajemen Detail Latihan</h1>
                     <div className="w-full md:w-1/3">
                         <input 
                             type="text"
                             placeholder="Cari latihan, sesi, atau program..."
                             value={searchTerm}
                             onChange={(e) => setSearchTerm(e.target.value)}
                             className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                         />
                     </div>
                    <button onClick={() => openModal()} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">
                        + Tambah Detail
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead className="border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-sm text-gray-600 font-semibold">Foto</th>
                                <th className="p-4 text-sm text-gray-600 font-semibold">Nama Latihan</th>
                                <th className="p-4 text-sm text-gray-600 font-semibold">Sesi Induk</th>
                                <th className="p-4 text-sm text-gray-600 font-semibold">Program</th>
                                <th className="p-4 text-sm text-gray-600 font-semibold">Rep/Dur</th>
                                <th className="p-4 text-sm text-gray-600 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* -- MODIFIKASI: Tampilkan Spinner atau data -- */}
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-10">
                                        <div className="flex justify-center items-center">
                                            <Spinner />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredDetails.length > 0 ? filteredDetails.map((item) => {
                                const fotoArray = item.foto && typeof item.foto === 'string' ? JSON.parse(item.foto) : [];
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="p-2 border-b border-gray-200">
                                            {fotoArray.length > 0 ? (
                                                <img src={`${BASE_URL}${fotoArray[0]}`} alt={item.nama_detail} className="w-16 h-16 object-cover rounded-md"/>
                                            ) : <div className="w-16 h-16 bg-gray-200 rounded-md"></div>}
                                        </td>
                                        <td className="p-4 border-b border-gray-200 font-medium text-gray-800">{item.nama_detail}</td>
                                        <td className="p-4 border-b border-gray-200 text-gray-600">{item.sesi_latihan?.nama_sesi || 'N/A'}</td>
                                        <td className="p-4 border-b border-gray-200 text-gray-600">{item.sesi_latihan?.program_latihan?.nama || 'N/A'}</td>
                                        <td className="p-4 border-b border-gray-200">{item.repetisi ? `${item.repetisi} reps` : `${item.durasi || '0'} detik`}</td>
                                        <td className="p-4 border-b border-gray-200 text-right space-x-2">
                                            <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-800 p-1"><EditIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 p-1"><DeleteIcon className="w-5 h-5"/></button>
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr><td colSpan="6" className="text-center p-4 text-gray-400">Tidak ada data yang cocok.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                        <header className="flex justify-between items-center p-6 border-b"><h2 className="text-xl font-semibold text-gray-800">{isEditing ? 'Edit Detail Latihan' : 'Tambah Detail Latihan'}</h2><button onClick={closeModal} className="text-gray-400 hover:text-gray-700"><CloseIcon className="w-6 h-6"/></button></header>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                {error && <p className="text-red-500 text-sm mb-2 p-2 bg-red-50 rounded-md">{error}</p>}
                                <div><label className={labelClasses}>Sesi Latihan</label><select name="sesi_latihan_id" value={formData.sesi_latihan_id || ''} onChange={handleChange} className={inputClasses} required><option value="" disabled>Pilih Sesi Induk</option>{sesiLatihans.map(sesi => <option key={sesi.id} value={sesi.id}>{sesi.nama_sesi} (Program: {sesi.program_latihan?.nama})</option>)}</select></div>
                                <div><label className={labelClasses}>Nama Detail Latihan</label><input type="text" name="nama_detail" placeholder="Contoh: Bench Press" value={formData.nama_detail || ''} onChange={handleChange} className={inputClasses} required /></div>
                                <div><label className={labelClasses}>Repetisi (opsional)</label><input type="number" name="repetisi" placeholder="Contoh: 12" value={formData.repetisi || ''} onChange={handleChange} className={inputClasses} /></div>
                                <div><label className={labelClasses}>Durasi (detik, opsional)</label><input type="number" name="durasi" placeholder="Contoh: 60" value={formData.durasi || ''} onChange={handleChange} className={inputClasses} /></div>
                                <div><label className={labelClasses}>Kategori</label><select name="kategori" value={formData.kategori || 'strength'} onChange={handleChange} className={inputClasses} required><option value="strength">Strength</option><option value="cardio">Cardio</option><option value="mobility">Mobility</option></select></div>
                                <div><label className={labelClasses}>Catatan (Opsional)</label><textarea name="note" value={formData.note || ''} onChange={handleChange} rows="3" className={inputClasses}></textarea></div>
                                <div><label className={labelClasses}>Foto (Opsional)</label><input type="file" name="foto" multiple onChange={handleChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/></div>
                            </div>
                            <footer className="flex justify-end gap-4 p-6 bg-gray-50 border-t"><button type="button" onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Batal</button><button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Simpan</button></footer>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailLatihanAdminPage;
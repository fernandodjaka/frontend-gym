import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- Helper Components & Icons (No external libraries) ---
const EditIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const DeleteIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const CloseIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

const SesiLatihanAdminPage = () => {
    const [sesiLatihans, setSesiLatihans] = useState([]);
    const [formData, setFormData] = useState({});
    const [programLatihans, setProgramLatihans] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const API_URL = 'http://localhost:8000/api';
    const token = localStorage.getItem('token');

    const fetchSesiLatihans = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/admin/sesi-latihan`, { headers: { Authorization: `Bearer ${token}` } });
            setSesiLatihans(response.data);
        } catch (err) {
            setError('Gagal memuat data sesi latihan.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchProgramLatihans = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/program-latihan`, { headers: { Authorization: `Bearer ${token}` } });
            setProgramLatihans(response.data);
        } catch (err) {
            console.error("Gagal memuat data program latihan:", err);
        }
    }, [token]);

    useEffect(() => {
        fetchSesiLatihans();
        fetchProgramLatihans();
    }, [fetchSesiLatihans, fetchProgramLatihans]);

    const openModal = (sesi = null) => {
        setIsEditing(!!sesi);
        setFormData(sesi ? { ...sesi } : {
            program_latihan_id: '',
            nama_sesi: '',
            deskripsi: '',
            urutan: 0
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setFormData({});
        setError('');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // --- VALIDASI SISI KLIEN ---
        if (!formData.program_latihan_id) {
            setError('Program Latihan wajib dipilih.');
            return;
        }
        if (!formData.nama_sesi || !formData.nama_sesi.trim()) {
            setError('Nama Sesi tidak boleh kosong.');
            return;
        }
        setError('');

        // Membuat payload yang bersih untuk dikirim ke backend
        const payload = {
            program_latihan_id: formData.program_latihan_id,
            nama_sesi: formData.nama_sesi,
            deskripsi: formData.deskripsi || null,
            urutan: formData.urutan || 0,
        };

        const url = isEditing ? `${API_URL}/admin/sesi-latihan/${formData.id}` : `${API_URL}/admin/sesi-latihan`;
        const method = isEditing ? 'put' : 'post';

        try {
            await axios[method](url, payload, { headers: { Authorization: `Bearer ${token}` } });
            fetchSesiLatihans();
            closeModal();
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData && errorData.errors) {
                // Menampilkan pesan error validasi yang lebih spesifik
                const firstErrorKey = Object.keys(errorData.errors)[0];
                const firstErrorMessage = errorData.errors[firstErrorKey][0];
                setError(`Error pada field '${firstErrorKey}': ${firstErrorMessage}`);
            } else {
                setError(errorData?.message || 'Terjadi kesalahan saat menyimpan.');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus sesi ini?')) {
            try {
                await axios.delete(`${API_URL}/admin/sesi-latihan/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchSesiLatihans();
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
                <h4 className="mb-6 text-2xl font-bold text-gray-800">Manajemen Sesi Latihan</h4>
                
                <button onClick={() => openModal()} className="mb-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    + Tambah Sesi
                </button>

                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead className="border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-sm text-gray-600 font-semibold">Urutan</th>
                                <th className="p-4 text-sm text-gray-600 font-semibold">Nama Sesi</th>
                                <th className="p-4 text-sm text-gray-600 font-semibold">Program Induk</th>
                                <th className="p-4 text-sm text-gray-600 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center p-4 text-gray-500">Memuat...</td></tr>
                            ) : sesiLatihans.length > 0 ? sesiLatihans.map((sesi) => (
                                <tr key={sesi.id} className="hover:bg-gray-50">
                                    <td className="p-4 border-b border-gray-200 font-medium text-gray-800">{sesi.urutan}</td>
                                    <td className="p-4 border-b border-gray-200">{sesi.nama_sesi}</td>
                                    <td className="p-4 border-b border-gray-200 text-gray-600">{sesi.program_latihan?.nama || 'N/A'}</td>
                                    <td className="p-4 border-b border-gray-200 text-right space-x-2">
                                        <button onClick={() => openModal(sesi)} className="text-blue-600 hover:text-blue-800 p-1"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(sesi.id)} className="text-red-600 hover:text-red-800 p-1"><DeleteIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="text-center p-4 text-gray-400">Belum ada data sesi latihan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
                        <header className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">{isEditing ? 'Edit Sesi Latihan' : 'Tambah Sesi Latihan'}</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-700"><CloseIcon className="w-6 h-6"/></button>
                        </header>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-4">
                                {error && (
                                    <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                                        {error}
                                    </div>
                                )}
                                <div>
                                    <label className={labelClasses}>Program Latihan</label>
                                    <select name="program_latihan_id" value={formData.program_latihan_id || ''} onChange={handleChange} className={inputClasses} required>
                                        <option value="" disabled>Pilih Program Induk</option>
                                        {programLatihans.map(program => <option key={program.id} value={program.id}>{program.nama}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClasses}>Nama Sesi</label>
                                    <input type="text" name="nama_sesi" placeholder="Contoh: Hari 1: Dada & Trisep" value={formData.nama_sesi || ''} onChange={handleChange} className={inputClasses} required />
                                </div>
                                <div>
                                    <label className={labelClasses}>Deskripsi (Opsional)</label>
                                    <textarea name="deskripsi" value={formData.deskripsi || ''} onChange={handleChange} rows="3" className={inputClasses}></textarea>
                                </div>
                                <div>
                                    <label className={labelClasses}>Urutan</label>
                                    <input type="number" name="urutan" value={formData.urutan || 0} onChange={handleChange} className={inputClasses} required />
                                </div>
                            </div>
                            <footer className="flex justify-end gap-4 p-6 bg-gray-50 border-t">
                                <button type="button" onClick={closeModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Batal</button>
                                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Simpan</button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SesiLatihanAdminPage;

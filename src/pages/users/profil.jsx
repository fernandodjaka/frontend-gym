import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Helper Components & Icons ---
const ArrowLeftIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;
const PencilSquareIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const SunIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.95-4.243l-1.59-1.591M5.25 12H3m4.243-4.95l-1.59-1.591M12 12a6 6 0 100 12 6 6 0 000-12z" /></svg>;
const MoonIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25c0 5.385 4.365 9.75 9.75 9.75 2.597 0 4.962-.992 6.752-2.648z" /></svg>;

// --- Dark Mode Hook ---
const useDarkMode = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return [theme, toggleTheme];
};


const ProfilePage = () => {
    const navigate = useNavigate();
    const [theme, toggleTheme] = useDarkMode(); // Panggil hook dark mode
    const [editMode, setEditMode] = useState(false);
    const [userData, setUserData] = useState(null);
    const [formData, setFormDataState] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const token = localStorage.getItem('token');
    const API_URL = 'http://localhost:8000/api';

    const fetchUserData = useCallback(async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/user`, { headers: { Authorization: `Bearer ${token}` } });
            setUserData(response.data);
            setFormDataState({
                nama_lengkap: response.data.nama_lengkap || '',
                jenis_kelamin: response.data.jenis_kelamin || '',
                usia: response.data.usia || '',
                tinggi_cm: response.data.tinggi_cm || '',
                berat_kg: response.data.berat_kg || '',
                detail_cedera: response.data.detail_cedera || '',
                tingkat_aktivitas: response.data.tingkat_aktivitas || '',
                pengalaman_gym: response.data.pengalaman_gym || '',
            });
        } catch (err) {
            console.error('Gagal mengambil data user:', err);
            setError('Gagal memuat data profil.');
        } finally {
            setLoading(false);
        }
    }, [token, navigate]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDataState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            const response = await axios.put(`${API_URL}/user/profile`, formData, { headers: { Authorization: `Bearer ${token}` } });
            setUserData(response.data.user);
            setSuccessMessage('Profil berhasil diperbarui!');
            setEditMode(false);
        } catch (err) {
            console.error('Gagal update profil:', err);
            setError(err.response?.data?.message || 'Gagal menyimpan perubahan. Periksa kembali data Anda.');
        }
    };

    if (loading || !userData) return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">Memuat profil...</div>;
    
    // Sesuaikan class untuk dark mode
    const InfoItem = ({ label, value }) => (
        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-right">{value || '-'}</p>
        </div>
    );
    
    const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100";
    const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

    return (
        // Tambahkan class dark mode ke div utama
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans transition-colors duration-300">
            <main className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <button onClick={() => navigate(-1)} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white p-2 rounded-full mr-4">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profil Saya</h1>
                    </div>
                    {/* Tombol Toggle Dark Mode */}
                    <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700">
                        {theme === 'light' ? <MoonIcon className="w-6 h-6"/> : <SunIcon className="w-6 h-6"/>}
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="flex-shrink-0">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${userData.nama_lengkap || 'U'}&background=0D8ABC&color=fff&size=96&bold=true`}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
                            />
                        </div>
                        <div className="w-full text-center sm:text-left">
                             <div className="flex flex-col sm:flex-row justify-between items-center">
                                 <div>
                                     <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{userData.nama_lengkap}</h2>
                                     <p className="text-gray-500 dark:text-gray-400">{userData.email}</p>
                                 </div>
                                 <button
                                     onClick={() => setEditMode(!editMode)}
                                     className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold py-2 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                                 >
                                     <PencilSquareIcon className="w-5 h-5"/>
                                     {editMode ? 'Batal' : 'Edit Profil'}
                                 </button>
                             </div>
                        </div>
                    </div>
                </div>
                
                {successMessage && <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-lg text-center">{successMessage}</div>}
                {error && <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg text-center">{error}</div>}

                {editMode ? (
                    // --- EDIT MODE ---
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Edit Informasi Pribadi</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className={labelClasses}>Nama Lengkap</label><input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} className={inputClasses}/></div>
                            <div><label className={labelClasses}>Usia</label><input type="number" name="usia" value={formData.usia} onChange={handleChange} className={inputClasses}/></div>
                            <div><label className={labelClasses}>Tinggi (cm)</label><input type="number" name="tinggi_cm" value={formData.tinggi_cm} onChange={handleChange} className={inputClasses}/></div>
                            <div><label className={labelClasses}>Berat (kg)</label><input type="number" name="berat_kg" value={formData.berat_kg} onChange={handleChange} className={inputClasses}/></div>
                            <div><label className={labelClasses}>Jenis Kelamin</label><select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} className={inputClasses}><option value="">Pilih...</option><option value="laki-laki">Laki-laki</option><option value="perempuan">Perempuan</option></select></div>
                            <div><label className={labelClasses}>Pengalaman Gym</label><select name="pengalaman_gym" value={formData.pengalaman_gym} onChange={handleChange} className={inputClasses}><option value="">Pilih...</option><option value="Pemula">Pemula</option><option value="Menengah">Menengah</option><option value="Berpengalaman">Berpengalaman</option></select></div>
                            <div className="md:col-span-2"><label className={labelClasses}>Tingkat Aktivitas</label><select name="tingkat_aktivitas" value={formData.tingkat_aktivitas} onChange={handleChange} className={inputClasses}><option value="">Pilih...</option><option value="Sangat Jarang">Sangat Jarang</option><option value="Jarang">Jarang (1-2x seminggu)</option><option value="Cukup Aktif">Cukup Aktif (3-4x seminggu)</option><option value="Sangat Aktif">Sangat Aktif (5-7x seminggu)</option></select></div>
                            <div className="md:col-span-2"><label className={labelClasses}>Catatan Cedera</label><textarea name="detail_cedera" value={formData.detail_cedera} onChange={handleChange} rows="3" className={inputClasses}></textarea></div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">Simpan Perubahan</button>
                        </div>
                    </form>
                ) : (
                    // --- VIEW MODE ---
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Informasi Umum</h2>
                                <InfoItem label="Jenis Kelamin" value={userData.jenis_kelamin}/>
                                <InfoItem label="Usia" value={userData.usia ? `${userData.usia} tahun` : null}/>
                                <InfoItem label="Tinggi Badan" value={userData.tinggi_cm ? `${userData.tinggi_cm} cm` : null}/>
                                <InfoItem label="Berat Badan" value={userData.berat_kg ? `${userData.berat_kg} kg` : null}/>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 mt-6">Info Kebugaran</h2>
                                 <InfoItem label="Level Aktivitas" value={userData.tingkat_aktivitas}/>
                                 <InfoItem label="Pengalaman Gym" value={userData.pengalaman_gym}/>
                            </div>
                         </div>
                         <div className="mt-6">
                              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Catatan Cedera</h2>
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">{userData.detail_cedera || 'Tidak ada catatan cedera.'}</p>
                         </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProfilePage;
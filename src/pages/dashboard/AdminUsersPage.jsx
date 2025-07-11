import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Komponen Ikon ---
const SearchIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> );
const EditIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg> );
const DeleteIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg> );
const XIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const EyeIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> );

// --- Komponen Spinner untuk Loading ---
const Spinner = ({ size = 'h-8 w-8' }) => (
  <svg className={`animate-spin ${size} text-blue-600`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// --- Komponen Modal untuk Form Tambah/Edit ---
const UserFormModal = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = !!user;

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                setFormData({ name: user.name || '', email: user.email || '', password: '', role: user.role || 'user' });
            } else {
                setFormData({ name: '', email: '', password: '', role: 'user' });
            }
        }
    }, [user, isOpen, isEditing]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSave(formData, user?.id);
        setIsSubmitting(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div initial={{ scale: 0.9, opacity: 0, y: -50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: -50 }} className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                        <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Nama Lengkap - name diubah menjadi 'name' agar sesuai dengan state */}
                            <div className="mb-4"><label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label><input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/></div>
                            <div className="mb-4"><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label><input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/></div>
                            <div className="mb-4"><label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label><input type="password" name="password" id="password" value={formData.password} onChange={handleChange} placeholder={isEditing ? 'Isi untuk mengubah' : ''} required={!isEditing} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/></div>
                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center min-w-[90px]">
                                    {isSubmitting ? <Spinner size="h-5 w-5"/> : <span>Simpan</span>}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Komponen Modal Detail Pengguna (Tidak ada perubahan) ---
const UserDetailModal = ({ isOpen, onClose, detailData, isLoading }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0, y: -50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: -50 }} className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
                         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                         <h2 className="text-2xl font-bold mb-6">Detail Pengguna</h2>
                         
                         {isLoading ? (
                             <div className="flex flex-col items-center justify-center h-64">
                                 <Spinner />
                                 <p className="mt-4 text-gray-600">Memuat riwayat...</p>
                             </div>
                         ) : detailData && !detailData.error ? (
                             <div>
                                 <div className="flex items-center mb-6 pb-4 border-b">
                                     <img src={detailData.avatar} alt="Avatar" className="h-20 w-20 rounded-full"/>
                                     <div className="ml-4">
                                         <p className="text-xl font-bold text-gray-900">{detailData.name}</p>
                                         <p className="text-md text-gray-500">{detailData.email}</p>
                                         <p className="text-sm text-gray-400">Terdaftar pada: {detailData.registeredDate}</p>
                                     </div>
                                 </div>
                                 
                                 <div>
                                     <h3 className="font-semibold text-lg mb-2">Riwayat Latihan</h3>
                                     {detailData.history?.length > 0 ? (
                                         <div className="max-h-64 overflow-y-auto pr-2 border rounded-md p-3 bg-gray-50">
                                             <ul className="space-y-3">
                                                 {detailData.history.map((item, index) => (
                                                     <li key={index} className="text-sm flex justify-between items-center p-2 rounded-md bg-white shadow-sm">
                                                         <span className="font-medium text-gray-700">{item.activity}</span>
                                                         <span className="text-xs text-gray-500">{item.date}</span>
                                                     </li>
                                                 ))}
                                             </ul>
                                         </div>
                                     ) : <p className="text-gray-500 italic mt-4">Tidak ada riwayat latihan ditemukan.</p>}
                                 </div>
                             </div>
                         ) : (
                             <div className="text-center text-red-500 h-64 flex items-center justify-center">
                                 <p>Gagal memuat data detail pengguna. <br/> {detailData?.error}</p>
                             </div>
                         )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}


const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [detailUserData, setDetailUserData] = useState(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    const API_BASE_URL = 'http://localhost:8000/api/admin';

    // --- PERBAIKAN 1: Memperbaiki infinite loop ---
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token otentikasi tidak ditemukan.');
            
            const response = await fetch(`${API_BASE_URL}/users`, {
                headers: { 
                    'Authorization': `Bearer ${token}`, 
                    'Accept': 'application/json' 
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Gagal memuat data: ${errorData.message || response.statusText}`);
            }

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []); // <-- Dependency array dikosongkan untuk mencegah loop

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenFormModal = (user = null) => {
        setEditingUser(user);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setEditingUser(null);
    };
    
    const handleViewDetails = async (userId) => {
        setIsDetailModalOpen(true);
        setIsDetailLoading(true);
        setDetailUserData(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, { 
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }, 
            });
            if (!response.ok) throw new Error('Gagal memuat detail pengguna.');
            const data = await response.json();
            setDetailUserData(data);
        } catch (err) {
            setDetailUserData({ error: err.message });
        } finally {
            setIsDetailLoading(false);
        }
    };
    
    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setDetailUserData(null);
    };

    // --- PERBAIKAN 2: Implementasi fungsi simpan (Create & Update) ---
    const handleSaveUser = async (formData, userId) => {
        const isEditing = !!userId;
        const url = isEditing ? `${API_BASE_URL}/users/${userId}` : `${API_BASE_URL}/users`;
        const method = isEditing ? 'PUT' : 'POST';

        // Menyesuaikan nama field untuk backend (nama_lengkap)
        const payload = {
            nama_lengkap: formData.name,
            email: formData.email,
            role: formData.role,
        };

        // Hanya kirim password jika diisi
        if (formData.password) {
            payload.password = formData.password;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Menampilkan pesan error dari validasi backend
                const errorMessages = Object.values(errorData.errors || {}).join(', ');
                throw new Error(errorData.message + (errorMessages ? `: ${errorMessages}`: ''));
            }
            
            handleCloseFormModal();
            fetchUsers(); // Muat ulang data setelah berhasil
        } catch (err) {
            alert(`Error: ${err.message}`); // Tampilkan error ke pengguna
        }
    };
    
    // --- PERBAIKAN 3: Implementasi fungsi hapus ---
    const handleDeleteUser = async (userId) => {
        // Konfirmasi sebelum menghapus
        if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menghapus pengguna.');
            }

            fetchUsers(); // Muat ulang data setelah berhasil
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(user =>
            (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, users]);

    const getStatusBadge = (status) => {
        if (status === 'Aktif') {
            return 'bg-green-100 text-green-800';
        }
        return 'bg-gray-100 text-gray-800';
    };

    if (isLoading && users.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <Spinner />
                <p className="text-gray-600 mt-4">Memuat data pengguna...</p>
            </div>
        );
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen bg-gray-50"><p className="text-red-600 text-center max-w-lg"><b>Error:</b><br/> {error}</p></div>;
    }

    return (
        <>
            <UserFormModal 
                isOpen={isFormModalOpen} 
                onClose={handleCloseFormModal} 
                user={editingUser}
                onSave={handleSaveUser}
            />
             <UserDetailModal 
                isOpen={isDetailModalOpen} 
                onClose={handleCloseDetailModal}
                detailData={detailUserData}
                isLoading={isDetailLoading}
            />
            <div className="bg-gray-50 min-h-screen font-sans antialiased">
                <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manajemen Pengguna</h1>
                                <p className="mt-1 text-gray-600">Lihat, cari, dan kelola semua pengguna terdaftar.</p>
                            </div>
                            <button onClick={() => handleOpenFormModal()} className="mt-4 md:mt-0 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                                Tambah Pengguna
                            </button>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white rounded-xl shadow-md">
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari pengguna berdasarkan nama atau email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img className="h-10 w-10 rounded-full" src={user.avatar} alt={`${user.name} avatar`} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/E2E8F0/4A5568?text=??'; }}/>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.registeredDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                    <div className="flex items-center space-x-4">
                                                        <button onClick={() => handleViewDetails(user.id)} className="text-gray-400 hover:text-green-600 transition-colors" title="Lihat Detail"><EyeIcon className="w-5 h-5"/></button>
                                                        <button onClick={() => handleOpenFormModal(user)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit"><EditIcon className="w-5 h-5"/></button>
                                                        <button onClick={() => handleDeleteUser(user.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Hapus"><DeleteIcon className="w-5 h-5"/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-12">
                                                <p className="text-gray-500">Tidak ada pengguna yang ditemukan.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </main>
            </div>
        </>
    );
};

export default AdminUsersPage;

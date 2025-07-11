import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Helper component for SVG icons
const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                }
            });

            // Check for access_token and save it as 'token' for consistency
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                navigate('/isi-data-diri');
            } else {
                setError('Registrasi gagal. Token tidak diterima.');
            }
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0][0];
                setError(firstError);
            } else {
                setError(err.message || 'Gagal melakukan pendaftaran. Silakan coba lagi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-2";

    return (
        <section className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
            <div className="w-full max-w-6xl overflow-hidden shadow-2xl rounded-xl bg-white">
                <div className="flex flex-col lg:flex-row">
                    {/* Left Column - Form */}
                    <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="text-center mb-8">
                            <h1 className="font-bold text-3xl md:text-4xl text-gray-900 mb-2">
                                Buat Akun Anda
                            </h1>
                            <p className="text-base text-gray-600">
                                Bergabunglah dengan komunitas kebugaran kami hari ini.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-3 bg-red-100 rounded-lg border border-red-300">
                                <p className="text-red-700 text-center text-sm font-medium">
                                    {error}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-2 mb-2 w-full max-w-md mx-auto">
                            <div className="mb-6 flex flex-col gap-6">
                                <div>
                                    <label htmlFor="email" className={labelClasses}>Alamat Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="nama@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className={labelClasses}>Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        required
                                        minLength={6}
                                    />
                                     <p className="mt-2 text-xs text-gray-500">
                                       Minimal 6 karakter.
                                     </p>
                                </div>
                            </div>



                            <button
                                type="submit"
                                className="mt-2 w-full flex justify-center items-center bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading && <LoadingSpinner />}
                                {isLoading ? 'Membuat Akun...' : 'Daftar'}
                            </button>

                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-600">
                                    Sudah punya akun?&nbsp;
                                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                                        Masuk di sini
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Image */}
                    <div className="w-full lg:w-1/2 hidden lg:block relative">
                         <img
                           src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop"
                           className="absolute h-full w-full object-cover"
                           alt="Seorang wanita sedang berlatih di gym"
                         />
                         <div className="absolute inset-0 bg-black/30"></div>
                         <div className="absolute bottom-0 left-0 right-0 p-12 text-white bg-gradient-to-t from-black/80 to-transparent">
                             <h2 className="text-3xl font-bold mb-2">Transformasi Dimulai Dari Sini</h2>
                             <p className="opacity-80">
                                Bergabunglah dengan pengguna lainnya yang telah merasakan manfaat dari program latihan kami.
                             </p>
                         </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Register;

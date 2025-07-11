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


export function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setIsLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:8000/api/login",
                { email, password },
                { headers: { "Content-Type": "application/json", "Accept": "application/json" } }
            );

            const { access_token, user } = response.data;
            localStorage.setItem("token", access_token);

            if (user.role === "admin") {
                navigate("/dashboard/home");
            } else if (user.role === "user") {
                navigate("/dashboard-user");
            } else {
                setErrorMsg("Role tidak dikenali.");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const message = error.response.data.errors?.email?.[0] || error.response.data.message || "Email atau password salah.";
                setErrorMsg(message);
            } else {
                setErrorMsg("Terjadi kesalahan saat login. Silakan coba lagi.");
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
                                Selamat Datang Kembali
                            </h1>
                            <p className="text-base text-gray-600">
                                Masuk ke akun Anda untuk melanjutkan.
                            </p>
                        </div>

                        {errorMsg && (
                            <div className="mb-6 p-3 bg-red-100 rounded-lg border border-red-300">
                                <p className="text-red-700 text-center text-sm font-medium">
                                    {errorMsg}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="mt-2 mb-2 w-full max-w-md mx-auto">
                            <div className="mb-6 flex flex-col gap-6">
                                <div>
                                    <label htmlFor="email" className={labelClasses}>Alamat Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="nama@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={inputClasses}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-4 w-full flex justify-center items-center bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading && <LoadingSpinner />}
                                {isLoading ? 'Masuk...' : 'Masuk'}
                            </button>
                            
                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-600">
                                    Belum punya akun?&nbsp;
                                    <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                                        Daftar di sini
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Image */}
                    <div className="w-full lg:w-1/2 hidden lg:block relative">
                         <img
                           src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop"
                           className="absolute h-full w-full object-cover"
                           alt="Seorang pria sedang berlatih di gym"
                         />
                         <div className="absolute inset-0 bg-black/30"></div>
                         <div className="absolute bottom-0 left-0 right-0 p-12 text-white bg-gradient-to-t from-black/80 to-transparent">
                             <h2 className="text-3xl font-bold mb-2">Lanjutkan Perjalanan Fitnessmu</h2>
                             <p className="opacity-80">
                               Akses dasbor personalmu dan kelola semua progres latihan dengan mudah.
                             </p>
                         </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SignIn;

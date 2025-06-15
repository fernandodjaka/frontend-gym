import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../component/navbar.jsx";

const LandingPage = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white pt-24 px-4"
      style={{
        backgroundImage: "url('/img/landing-page.jpg')", // Pastikan gambar ini ada di /public/images/
      }}
    >
      {/* Overlay agar teks terbaca */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

      <Navbar />

      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[calc(100vh-6rem)]">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold mb-4"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50, duration: 1 }}
        >
          Selamat Datang di Gym Tracker
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl mb-6 max-w-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          Pantau kebugaranmu, atur latihan, dan konsultasi dengan AI untuk hasil yang lebih cerdas dan sehat!
        </motion.p>

        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <Link to="/auth/sign-in">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
              Masuk
            </button>
          </Link>
          <Link to="/auth/register">
            <button className="bg-white text-blue-600 px-6 py-3 border border-blue-600 rounded-lg shadow-md hover:bg-blue-100 transition duration-300">
              Daftar
            </button>
          </Link>
        </motion.div>

        {/* Tambahan fitur utama */}
        <motion.div
          className="mt-6 grid md:grid-cols-2 gap-6 max-w-4xl w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-2">Konsultasi Online AI</h3>
            <p>Konsultasikan progress latihanmu secara otomatis dengan AI kami untuk saran personal.</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-2">Hitung Kadar Lemak</h3>
            <p>Gunakan kalkulator kadar lemak tubuh kami untuk memantau komposisi tubuh secara akurat.</p>
          </div>
        </motion.div>
      </div>

      <motion.footer
        className="relative z-10 text-sm text-white text-center mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        &copy; {new Date().getFullYear()} Gym Tracker - Dibuat dengan ❤️ untuk kebugaranmu
      </motion.footer>
    </div>
  );
};

export default LandingPage;

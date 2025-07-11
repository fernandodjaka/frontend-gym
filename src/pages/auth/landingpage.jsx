import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";

// --- IKON SVG BISA DIPINDAHKAN KE FILE TERPISAH (MISAL: Icons.js) ---
const IconChart = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg> );
const IconBrain = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15A2.5 2.5 0 0 1 9.5 22" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15A2.5 2.5 0 0 0 14.5 22" /><path d="M12 2v20" /></svg> );
const IconTarget = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg> );
const MenuIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
const XIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);


const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-white text-gray-800 font-sans antialiased">
      
      {/* --- NAVBAR DISEMPURNAKAN DENGAN MOBILE MENU --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200/80 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <RouterLink to="/" className="text-gray-900 text-2xl font-bold tracking-wider">
              Home<span className="text-blue-600">Fit</span>
            </RouterLink>
            
            {/* <-- MODIFIKASI: Menambahkan link "Home" --> */}
            <div className="hidden md:flex items-baseline space-x-8">
                <ScrollLink to="home" smooth={true} offset={-80} duration={500} className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer font-medium">Home</ScrollLink>
                <ScrollLink to="fitur" smooth={true} offset={-80} duration={500} className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer font-medium">Fitur</ScrollLink>
                <ScrollLink to="langkah" smooth={true} offset={-80} duration={500} className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer font-medium">Cara Kerja</ScrollLink>
                <ScrollLink to="tentang-kami" smooth={true} offset={-80} duration={500} className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer font-medium">Tentang Kami</ScrollLink>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <RouterLink to="/login" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Masuk</RouterLink>
              <RouterLink to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">Daftar Gratis</RouterLink>
            </div>

            {/* --- TOMBOL HAMBURGER MENU UNTUK MOBILE --- */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800">
                {isMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* --- PANEL MOBILE MENU --- */}
        <AnimatePresence>
        {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-white/90 backdrop-blur-lg border-t border-gray-200/80"
            >
              {/* <-- MODIFIKASI: Menambahkan link "Home" di menu mobile --> */}
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                  <ScrollLink to="home" smooth={true} offset={-80} duration={500} className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium cursor-pointer" onClick={() => setIsMenuOpen(false)}>Home</ScrollLink>
                  <ScrollLink to="fitur" smooth={true} offset={-80} duration={500} className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium cursor-pointer" onClick={() => setIsMenuOpen(false)}>Fitur</ScrollLink>
                  <ScrollLink to="langkah" smooth={true} offset={-80} duration={500} className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium cursor-pointer" onClick={() => setIsMenuOpen(false)}>Cara Kerja</ScrollLink>
                  <ScrollLink to="tentang-kami" smooth={true} offset={-80} duration={500} className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium cursor-pointer" onClick={() => setIsMenuOpen(false)}>Tentang Kami</ScrollLink>
                  <div className="border-t border-gray-200 my-2"></div>
                  <RouterLink to="/login" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Masuk</RouterLink>
                  <RouterLink to="/register" className="block w-full bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm mt-2" onClick={() => setIsMenuOpen(false)}>Daftar Gratis</RouterLink>
              </div>
            </motion.div>
        )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION DENGAN GRADIENT BACKGROUND --- */}
      <section id="home" className="relative min-h-screen flex items-center pt-24 pb-12 px-4 overflow-hidden">
        {/* --- Latar Belakang Gradien --- */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/50 rounded-full filter blur-3xl opacity-50 -z-10 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/50 rounded-full filter blur-3xl opacity-50 -z-10 translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-gray-900 mb-6 leading-tight">
                    Latihan Cerdas, <br /> Raih Hasil <span className="text-blue-600">Nyata</span>.
                </h1>
                <p className="text-lg text-gray-600 mb-10 max-w-lg">
                    Platform kebugaran personal berbasis AI. Dapatkan program latihan yang dirancang khusus untuk Anda, lacak progres, dan capai tujuan kebugaran lebih cepat.
                </p>
                <div className="flex items-center gap-4">
                    <RouterLink to="/register">
                        <motion.button 
                          className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                            Mulai Sekarang
                        </motion.button>
                    </RouterLink>
                </div>
                <p className="text-sm text-gray-500 mt-6">✓ Gratis selamanya. ✓ Didasari sains.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}>
                {/* --- MENGGANTI GAMBAR DENGAN YANG LEBIH RELEVAN DAN MODERN --- */}
                <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop" 
                    alt="Orang sedang berolahraga di gym" 
                    className="rounded-3xl shadow-2xl object-cover"
                />
            </motion.div>
        </div>
      </section>

      {/* --- FITUR SECTION (DIPERBARUI) --- */}
    <section id="fitur" className="py-24 px-4 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 mb-4">Platform Cerdas untuk Hasil Nyata</motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-3xl mx-auto">Semua yang Anda butuhkan untuk memulai, mengukur, dan mencapai tujuan kebugaran Anda.</motion.p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
            {/* --- KARTU FITUR 1 --- */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:-translate-y-2">
                <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4"><IconTarget /></div>
                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Program Latihan Personal</h3>
                <p className="text-gray-600">Sistem AI kami merekomendasikan program latihan paling efektif berdasarkan data dan tujuan unik Anda.</p>
            </motion.div>

            {/* --- KARTU FITUR 2 (DIPERBARUI) --- */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:-translate-y-2">
                <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4"><IconChart /></div>
                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Kalkulator BMI & Lemak</h3>
                <p className="text-gray-600">Gunakan kalkulator BMI untuk mendapat perkiraan komposisi lemak tubuh dan lacak progres Anda.</p>
            </motion.div>

            {/* --- KARTU FITUR 3 --- */}
            <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:-translate-y-2">
                <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4"><IconBrain /></div>
                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Asisten AI 24/7</h3>
                <p className="text-gray-600">Dapatkan jawaban instan untuk pertanyaan seputar latihan dan nutrisi dari asisten virtual cerdas kami.</p>
            </motion.div>
        </motion.div>
      </div>
    </section>


      {/* --- LANGKAH-LANGKAH SECTION YANG DIDESAIN ULANG --- */}
      <section id="langkah" className="py-24 px-4 bg-gray-50/80">
        <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={containerVariants}
            >
                <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 mb-4">Hanya 3 Langkah Mudah</motion.h2>
                <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto">Mulai perjalanan kebugaran Anda dalam beberapa menit saja.</motion.p>
            </motion.div>
            {/* --- Menggunakan flexbox untuk garis penghubung imajiner --- */}
            <div className="relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-300/70 -translate-y-8"></div>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={containerVariants}
                >
                    <motion.div variants={itemVariants} className="relative">
                        <div className="flex items-center justify-center bg-white border-2 border-gray-200 w-20 h-20 rounded-full mx-auto mb-6"><span className="text-3xl font-bold text-blue-600">1</span></div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Buat Akun Gratis</h3>
                        <p className="text-gray-600 px-4">Daftarkan diri Anda dalam sekejap, tanpa biaya tersembunyi.</p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="relative">
                        <div className="flex items-center justify-center bg-white border-2 border-gray-200 w-20 h-20 rounded-full mx-auto mb-6"><span className="text-3xl font-bold text-blue-600">2</span></div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Isi Profil Anda</h3>
                        <p className="text-gray-600 px-4">Beri tahu kami tujuan, preferensi, dan level kebugaran Anda.</p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="relative">
                        <div className="flex items-center justify-center bg-white border-2 border-gray-200 w-20 h-20 rounded-full mx-auto mb-6"><span className="text-3xl font-bold text-blue-600">3</span></div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Dapatkan Program</h3>
                        <p className="text-gray-600 px-4">Sistem AI kami akan langsung membuatkan program latihan untuk Anda.</p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
      </section>

      {/* --- TENTANG KAMI SECTION (DESAIN ULANG) --- */}
    <section id="tentang-kami" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-16">
        {/* --- Kolom Teks (sekarang di kiri) --- */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true, amount: 0.5 }} 
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="text-blue-600 font-semibold tracking-wide uppercase">Misi Kami</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 my-4">
            Mewujudkan Potensi Kebugaran Anda.
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            HomeFit lahir dari keyakinan bahwa panduan kebugaran yang cerdas dan personal harus dapat diakses oleh semua orang. Kami bukan sekadar platform, melainkan partner digital dalam perjalanan transformasi Anda.
          </p>
          
          {/* --- Elemen Kutipan untuk Menarik Perhatian --- */}
          <div className="border-l-4 border-blue-500 pl-6 py-2 bg-blue-50/50 rounded-r-lg">
            <p className="text-lg italic text-gray-700">
              "Dengan memadukan ilmu olahraga dan AI, kami berkomitmen membantu Anda mencapai hasil yang nyata dan berkelanjutan."
            </p>
          </div>

        </motion.div>

        {/* --- Kolom Gambar (sekarang di kanan) --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true, amount: 0.5 }} 
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <img 
            src="/img/tentang-kami.jpg" 
            alt="Seseorang sedang lari" 
            className="rounded-3xl shadow-xl object-cover w-full h-[500px]"
          />
        </motion.div>

      </div>
    </section>


      {/* --- CTA SECTION --- */}
      <section className="py-24 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={containerVariants}>
                <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 mb-6">Mulai Transformasi Anda Hari Ini</motion.h2>
                <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">Tidak ada waktu yang lebih baik dari sekarang. Bergabunglah dengan komunitas kami dan capai versi terbaik dari diri Anda. Gratis.</motion.p>
                <motion.div variants={itemVariants}>
                    <RouterLink to="/auth/register">
                        <motion.button 
                            className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Buat Akun Gratis Sekarang
                        </motion.button>
                    </RouterLink>
                </motion.div>
            </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 px-4 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} HomeFit. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

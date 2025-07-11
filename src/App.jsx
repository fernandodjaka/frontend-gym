import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Latihan from "@/layouts/latihan";

// User Pages
import UserDashboard from "./pages/users/Dashboard-user";
import ProfilePage from "./pages/users/profil";
import BodyFatCalculator from "./pages/users/kalkulatorfat";
import KonsultasiOnline from "./pages/users/KonsultasiOnline";

// Program Latihan Flow
import PilihTujuan from "./pages/users/PilihTujuan";
import PilihProgram from "./pages/users/PilihProgram";
import RekomendasiSesiPage from "./pages/users/RekomendasiSesiPage";
import PilihSesiPage from "./pages/users/PilihSesiPage";
import DetailProgram from "./pages/users/DetailProgram";
import LatihanHariIni from "./pages/users/LatihanHariIni";
import { LandingPage } from "./pages/auth";
import { Register } from "./pages/auth";
import { SignIn } from "./pages/auth";
import { IsiDataDiri } from "./pages/auth";

function App() {
  return (
    <Routes>
      
      <Route path="/landing-page" element={<LandingPage/>} />
      <Route path="/login" element={<SignIn/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/isi-data-diri" element={<IsiDataDiri/>} />

      {/* Rute Admin & Layout Umum */}
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/latihan/*" element={<Latihan />} />

      {/* Rute Halaman Pengguna */}
      <Route path="/dashboard-user" element={<UserDashboard/>} />
      <Route path="/profil" element={<ProfilePage/>} />
      <Route path="/kalkulator-fat" element={<BodyFatCalculator/>} />
      <Route path="/konsultasi-online" element={<KonsultasiOnline/>} />

      {/* Alur Utama Program Latihan untuk Pengguna */}
      <Route path="/program" element={<PilihTujuan />} />
      <Route path="/program/:tujuanId" element={<PilihProgram />} />
      
      {/* Rute SPK untuk menampilkan hasil rekomendasi sesi */}
      <Route path="/program/:programId/rekomendasi" element={<RekomendasiSesiPage />} />

      {/* Rute untuk melihat semua sesi (jika diperlukan) */}
      <Route path="/program/:programId/sesi" element={<PilihSesiPage />} /> 

      {/* Rute untuk melihat detail statis dari sebuah program */}
      <Route path="/program/detail/:programId" element={<DetailProgram />} />

      {/* ===================================================================
        PERBAIKAN: Rute untuk halaman latihan interaktif disesuaikan
        agar cocok dengan URL dari backend. Kata '/latihan' dihapus.
        ===================================================================
      */}
      <Route path="/program/:programId/sesi/:sesiId" element={<LatihanHariIni />} />
      
      {/* Rute default, bisa diarahkan ke landing page atau dashboard */}
      <Route path="*" element={<Navigate to="/dashboard-user" replace />} />
    </Routes>
  );
}

export default App;

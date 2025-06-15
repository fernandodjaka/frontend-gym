import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Latihan from "@/layouts/latihan"; // ✅
import BodyFatCalculator from "./pages/users/kalkulatorfat";
import KonsultasiOnline from "./pages/users/KonsultasiOnline";
import UserDashboard from "./pages/users/Dashboard-user";

import ProfilePage from "./pages/users/profil";
import TujuanUser from "./pages/users/tujuan-user";
import ProgramUser from "./pages/users/program-user";




function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/latihan/*" element={<Latihan />} />
      <Route path="/kalkulator-fat" element={<BodyFatCalculator/>} />
      <Route path="/konsultasi-online" element={<KonsultasiOnline/>} />
      <Route path="/dashboard-user" element={<UserDashboard/>} />

      <Route path="/profil" element={<ProfilePage/>} />
      <Route path="/tujuan-user" element={<TujuanUser/>}/>
      <Route path="/program-user" element={<ProgramUser/>} />

      
      {/* <Route path="*" element={<Navigate to="/dashboard/home" replace />} /> */}
    </Routes>
  );
}

export default App;

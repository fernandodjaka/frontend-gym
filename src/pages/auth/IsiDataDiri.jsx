import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// SVG Icon to replace heroicons dependency
const InformationCircleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
);


const IsiDataDiri = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    usia: "",
    jenis_kelamin: "",
    tinggi_cm: "",
    berat_kg: "",
    tingkat_aktivitas: "",
    pengalaman_gym: "",
    memiliki_cedera: null,
    detail_cedera: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [showAlert, setShowAlert] = useState(false);

  const token = localStorage.getItem("token");

  // Universal handler for standard form inputs
  const handleChange = (e) => {
      const { name, value } = e.target;
      setMessage({ text: "", type: "" });
      setShowAlert(false);
      setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Specific handler for custom selections (buttons, etc.)
  const handleSelectionChange = (name, value) => {
      setMessage({ text: "", type: "" });
      setShowAlert(false);
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInjuryChange = (value) => {
    handleSelectionChange("memiliki_cedera", value);
    if (!value) {
      handleSelectionChange("detail_cedera", "");
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.nama_lengkap || !formData.usia) {
        setMessage({ text: "Nama Lengkap dan Usia wajib diisi.", type: "error" });
        setShowAlert(true);
        return false;
      }
    }
    if (step === 2) {
      if (!formData.jenis_kelamin) {
        setMessage({ text: "Jenis Kelamin wajib dipilih.", type: "error" });
        setShowAlert(true);
        return false;
      }
    }
    if (step === 3) {
      if (!formData.tingkat_aktivitas || !formData.pengalaman_gym || formData.memiliki_cedera === null) {
        setMessage({ text: "Semua field di langkah ini wajib diisi.", type: "error" });
        setShowAlert(true);
        return false;
      }
      if (formData.memiliki_cedera && !formData.detail_cedera) {
        setMessage({ text: "Detail cedera wajib diisi jika Anda memilih 'Ya'.", type: "error" });
        setShowAlert(true);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    const finalData = {
      ...formData,
      usia: parseInt(formData.usia, 10),
      tinggi_cm: formData.tinggi_cm ? parseInt(formData.tinggi_cm, 10) : null,
      berat_kg: formData.berat_kg ? parseFloat(formData.berat_kg) : null,
      memiliki_cedera: Boolean(formData.memiliki_cedera),
      detail_cedera: formData.memiliki_cedera ? formData.detail_cedera : "",
    };

    try {
      await axios.post("http://localhost:8000/api/isi-data-diri", finalData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage({ text: "Data berhasil disimpan! Anda akan diarahkan...", type: "success" });
      setShowAlert(true);
      setTimeout(() => navigate("/dashboard-user"), 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Gagal menyimpan data. Silakan coba lagi.";
      setMessage({ text: errorMessage, type: "error" });
      setShowAlert(true);
      console.error("Gagal menyimpan:", error.response?.data || error.message);
    }
  };

  const progressValue = step === 1 ? 33.3 : step === 2 ? 66.6 : 100;
  
  const getSelectionClasses = (isSelected) =>
    isSelected
      ? "bg-blue-600 border-blue-600 text-white"
      : "bg-blue-gray-50 border-gray-300 text-gray-800 hover:bg-gray-200";
  
  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl">
        <div className="p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Lengkapi Profil Anda
            </h1>
            <p className="text-gray-600 mt-2">
              Beri kami sedikit info agar kami bisa menyesuaikan program untukmu.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-blue-700">Langkah {step} dari 3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{width: `${progressValue}%`}}></div>
            </div>
          </div>
          
          {showAlert && (
            <div 
              className={`p-4 mb-6 rounded-lg flex items-start text-white ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}
            >
              <InformationCircleIcon className="h-6 w-6 mr-3 mt-px flex-shrink-0"/>
              <span className="flex-grow">{message.text}</span>
              <button onClick={() => setShowAlert(false)} className="ml-4 text-2xl font-light leading-none">&times;</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                    <label htmlFor="nama_lengkap" className={labelClasses}>Nama Lengkap</label>
                    <input id="nama_lengkap" type="text" className={inputClasses} name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="usia" className={labelClasses}>Usia</label>
                    <input id="usia" type="number" className={inputClasses} name="usia" value={formData.usia} onChange={handleChange} required />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                 <div>
                    <p className={labelClasses}>Jenis Kelamin</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div onClick={() => handleSelectionChange("jenis_kelamin", "laki-laki")} className={`p-4 rounded-lg cursor-pointer text-center font-semibold border-2 transition-all ${getSelectionClasses(formData.jenis_kelamin === 'laki-laki')}`}>Laki-laki</div>
                        <div onClick={() => handleSelectionChange("jenis_kelamin", "perempuan")} className={`p-4 rounded-lg cursor-pointer text-center font-semibold border-2 transition-all ${getSelectionClasses(formData.jenis_kelamin === 'perempuan')}`}>Perempuan</div>
                    </div>
                </div>
                <div>
                    <label htmlFor="tinggi_cm" className={labelClasses}>Tinggi (cm, opsional)</label>
                    <input id="tinggi_cm" type="number" className={inputClasses} name="tinggi_cm" value={formData.tinggi_cm} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="berat_kg" className={labelClasses}>Berat (kg, opsional)</label>
                    <input id="berat_kg" type="number" step="0.1" className={inputClasses} name="berat_kg" value={formData.berat_kg} onChange={handleChange} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                 <div>
                    <label htmlFor="tingkat_aktivitas" className={labelClasses}>Tingkat Aktivitas</label>
                    <select id="tingkat_aktivitas" name="tingkat_aktivitas" value={formData.tingkat_aktivitas} onChange={handleChange} required className={inputClasses}>
                        <option value="" disabled>-- Pilih --</option>
                        <option value="Sangat Jarang">Sangat Jarang (Sedentary)</option>
                        <option value="Jarang">Jarang (1-2x seminggu)</option>
                        <option value="Cukup Aktif">Cukup Aktif (3-4x seminggu)</option>
                        <option value="Sangat Aktif">Sangat Aktif (5-7x seminggu)</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="pengalaman_gym" className={labelClasses}>Pengalaman Gym</label>
                    <select id="pengalaman_gym" name="pengalaman_gym" value={formData.pengalaman_gym} onChange={handleChange} required className={inputClasses}>
                        <option value="" disabled>-- Pilih --</option>
                        <option value="Pemula">Pemula (Baru mulai)</option>
                        <option value="Menengah">Menengah (&lt; 1 tahun)</option>
                        <option value="Berpengalaman">Berpengalaman (&gt; 1 tahun)</option>
                    </select>
                </div>
                 <div>
                    <p className={labelClasses}>Apakah Anda memiliki cedera?</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div onClick={() => handleInjuryChange(true)} className={`p-4 rounded-lg cursor-pointer text-center font-semibold border-2 transition-all ${getSelectionClasses(formData.memiliki_cedera === true)}`}>Ya</div>
                        <div onClick={() => handleInjuryChange(false)} className={`p-4 rounded-lg cursor-pointer text-center font-semibold border-2 transition-all ${getSelectionClasses(formData.memiliki_cedera === false)}`}>Tidak</div>
                    </div>
                </div>
                {formData.memiliki_cedera && (
                  <div className="animate-fade-in">
                     <label htmlFor="detail_cedera" className={labelClasses}>Detail Cedera Anda</label>
                    <textarea id="detail_cedera" name="detail_cedera" value={formData.detail_cedera} onChange={handleChange} className={inputClasses} rows="3"></textarea>
                  </div>
                )}
              </div>
            )}

            <div className="mt-10 flex justify-between items-center">
              {step > 1 ? (
                <button type="button" onClick={handleBack} className="px-6 py-2 font-semibold text-gray-700 bg-transparent rounded-lg hover:bg-gray-200 transition-colors">
                  Kembali
                </button>
              ) : <div />}
              {step < 3 ? (
                <button type="button" onClick={handleNext} className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
                  Selanjutnya
                </button>
              ) : (
                <button type="submit" className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all">
                  Simpan Profil
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IsiDataDiri;

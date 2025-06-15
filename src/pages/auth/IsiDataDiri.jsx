import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    memiliki_cedera: "",
    detail_cedera: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const finalData = {
      ...formData,
      memiliki_cedera: formData.memiliki_cedera === "1", // ubah ke boolean
      detail_cedera: formData.memiliki_cedera === "1" ? formData.detail_cedera : "", // kosongkan kalau tidak cedera
    };
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/isi-data-diri",
        finalData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Data berhasil disimpan!");
      console.log(response.data);
      navigate("/dashboard-user");
    } catch (error) {
      console.error("Gagal menyimpan:", error.response?.data || error.message);
      alert("Gagal menyimpan data. Cek console untuk detail.");
    }
  };
  

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Isi Data Diri</h2>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <label className="block mb-2">
              Nama Lengkap:
              <input
                type="text"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
                required
              />
            </label>
            <label className="block mb-2">
              Usia:
              <input
                type="number"
                name="usia"
                value={formData.usia}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
                required
              />
            </label>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-4">
              <p className="mb-2">Jenis Kelamin:</p>
              <div className="flex gap-4">
                <label className="border px-4 py-2 rounded cursor-pointer w-full text-center">
                  <input
                    type="radio"
                    name="jenis_kelamin"
                    value="laki-laki"
                    checked={formData.jenis_kelamin === "laki-laki"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  Laki-laki
                </label>
                <label className="border px-4 py-2 rounded cursor-pointer w-full text-center">
                  <input
                    type="radio"
                    name="jenis_kelamin"
                    value="perempuan"
                    checked={formData.jenis_kelamin === "perempuan"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  Perempuan
                </label>
              </div>
            </div>

            <label className="block mb-2">
              Tinggi (cm):
              <input
                type="number"
                name="tinggi_cm"
                value={formData.tinggi_cm}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
              />
            </label>
            <label className="block mb-2">
              Berat (kg):
              <input
                type="number"
                name="berat_kg"
                value={formData.berat_kg}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
              />
            </label>
          </>
        )}

        {step === 3 && (
          <>
            <label className="block mb-2">
              Tingkat Aktivitas:
              <input
                type="text"
                name="tingkat_aktivitas"
                value={formData.tingkat_aktivitas}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
                required
              />
            </label>
            <label className="block mb-2">
              Pengalaman Gym:
              <input
                type="text"
                name="pengalaman_gym"
                value={formData.pengalaman_gym}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
                required
              />
            </label>
            <label className="block mb-2">
              Memiliki Cedera:
              <select
                name="memiliki_cedera"
                value={formData.memiliki_cedera}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
              >
                <option value="">-- Pilih --</option>
                <option value="1">Ya</option>
                <option value="0">Tidak</option>
              </select>
            </label>
            {formData.memiliki_cedera === "1" && (
              <label className="block mb-2">
                Detail Cedera:
                <textarea
                  name="detail_cedera"
                  value={formData.detail_cedera}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded mt-1"
                ></textarea>
              </label>
            )}
          </>
        )}

        <div className="mt-4 flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Kembali
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Selanjutnya
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Simpan
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default IsiDataDiri;

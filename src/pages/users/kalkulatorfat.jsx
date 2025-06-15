import React, { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  Select,
  Option,
  Alert,
} from "@material-tailwind/react";

const BodyFatCalculator = () => {
  const [berat, setBerat] = useState("");
  const [tinggi, setTinggi] = useState("");
  const [usia, setUsia] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("pria");
  const [hasil, setHasil] = useState(null);

  const hitung = () => {
    const beratNum = parseFloat(berat);
    const tinggiM = parseFloat(tinggi) / 100;
    const usiaNum = parseInt(usia);
    const gender = jenisKelamin === "pria" ? 1 : 0;

    if (!beratNum || !tinggiM || !usiaNum) {
      alert("Mohon lengkapi semua input.");
      return;
    }

    const bmi = beratNum / (tinggiM * tinggiM);
    const bodyFat = (1.20 * bmi) + (0.23 * usiaNum) - (10.8 * gender) - 5.4;

    let kategori = "";
    if (gender === 1) {
      kategori =
        bodyFat < 6
          ? "Sangat Rendah"
          : bodyFat < 18
          ? "Normal"
          : bodyFat < 25
          ? "Tinggi"
          : "Sangat Tinggi";
    } else {
      kategori =
        bodyFat < 14
          ? "Sangat Rendah"
          : bodyFat < 25
          ? "Normal"
          : bodyFat < 32
          ? "Tinggi"
          : "Sangat Tinggi";
    }

    setHasil({
      bmi: bmi.toFixed(2),
      fat: bodyFat.toFixed(2),
      kategori,
    });
  };

  return (
    <div className="mt-10 px-6 max-w-2xl mx-auto">
      <Typography variant="h3" className="text-center mb-4 text-blue-900">
        Kalkulator Kadar Lemak Tubuh
      </Typography>

      <Typography variant="paragraph" className="text-gray-600 mb-6 text-center">
        Gunakan kalkulator ini untuk memperkirakan <strong>persentase lemak tubuh</strong> Anda
        berdasarkan <strong>berat badan</strong>, <strong>tinggi badan</strong>, <strong>usia</strong>,
        dan <strong>jenis kelamin</strong>.
      </Typography>

      <Card shadow={true}>
        <CardBody className="space-y-4">
          <Input
            label="Berat Badan (kg)"
            type="number"
            value={berat}
            onChange={(e) => setBerat(e.target.value)}
          />
          <Input
            label="Tinggi Badan (cm)"
            type="number"
            value={tinggi}
            onChange={(e) => setTinggi(e.target.value)}
          />
          <Input
            label="Usia"
            type="number"
            value={usia}
            onChange={(e) => setUsia(e.target.value)}
          />
          <Select
            label="Jenis Kelamin"
            value={jenisKelamin}
            onChange={(val) => setJenisKelamin(val)}
          >
            <Option value="pria">Pria</Option>
            <Option value="wanita">Wanita</Option>
          </Select>

          <Button onClick={hitung} color="blue" className="w-full">
            Hitung Kadar Lemak
          </Button>

          {hasil && (
            <div className="mt-6 p-4 rounded-md bg-gradient-to-r from-blue-100 to-blue-50">
              <Typography variant="h5" color="blue-gray" className="mb-2">
                Hasil Anda
              </Typography>
              <div className="text-sm text-gray-800 space-y-2">
                <p>
                  <strong>BMI:</strong> {hasil.bmi}
                </p>
                <p>
                  <strong>Kadar Lemak Tubuh:</strong> {hasil.fat}%
                </p>
                <p>
                  <strong>Kategori:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      hasil.kategori === "Normal"
                        ? "text-green-600"
                        : hasil.kategori.includes("Tinggi")
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {hasil.kategori}
                  </span>
                </p>
              </div>
              <hr className="my-3" />
              <Typography variant="small" className="text-gray-600">
                <strong>Catatan:</strong> Ini hanya estimasi berdasarkan rumus BMI, dan mungkin tidak
                akurat untuk atlet, lansia, atau individu dengan komposisi tubuh yang unik.
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default BodyFatCalculator;

// src/pages/user/KontenLatihan.jsx
import React from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";

const kontenLatihan = [
  {
    id: 1,
    judul: "Latihan Dasar Fisik",
    deskripsi: "Melatih kekuatan otot dan ketahanan tubuh.",
    tingkat: "Pemula",
  },
  {
    id: 2,
    judul: "Latihan Kecepatan",
    deskripsi: "Meningkatkan kecepatan dan refleks.",
    tingkat: "Menengah",
  },
  {
    id: 3,
    judul: "Latihan Konsentrasi",
    deskripsi: "Meningkatkan fokus dan konsentrasi saat bertanding.",
    tingkat: "Lanjutan",
  },
];

const KontenLatihan = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Typography variant="h4" className="mb-6 text-blue-600">
        Konten Latihan
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kontenLatihan.map((konten) => (
          <Card key={konten.id} className="shadow-lg">
            <CardBody>
              <div className="flex items-center gap-3 mb-4">
                <ClipboardDocumentListIcon className="w-8 h-8 text-blue-500" />
                <Typography variant="h5">{konten.judul}</Typography>
              </div>
              <Typography className="text-sm text-gray-700 mb-2">
                {konten.deskripsi}
              </Typography>
              <Typography className="text-xs text-gray-500 mb-4">
                Tingkat: {konten.tingkat}
              </Typography>
              <Button color="blue" size="sm">Mulai</Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KontenLatihan;

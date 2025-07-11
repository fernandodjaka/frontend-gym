import React from "react";
import {
  Typography,
  Card,
  CardBody,
} from "@material-tailwind/react";
import {
  UserGroupIcon,
  CheckBadgeIcon,
  RectangleStackIcon,
  ClockIcon,
  ListBulletIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

// --- DATA UNTUK KARTU NAVIGASI ---
// Anda bisa dengan mudah menambah, mengubah, atau menghapus item di sini
const adminPages = [
  {
    title: "Kelola Pengguna",
    description: "Lihat, tambah, edit, dan hapus data anggota gym.",
    icon: UserGroupIcon,
    path: "/dashboard/profile-users", // Ganti dengan path Anda yang sebenarnya
    color: "from-blue-500 to-blue-700",
  },
  {
    title: "Tujuan Latihan",
    description: "Atur berbagai tujuan latihan yang tersedia untuk program.",
    icon: CheckBadgeIcon,
    path: "/latihan/tujuan-latihan", // Ganti dengan path Anda yang sebenarnya
    color: "from-purple-500 to-purple-700",
  },
  {
    title: "Program Latihan",
    description: "Buat dan kelola program latihan berdasarkan tujuan.",
    icon: RectangleStackIcon,
    path: "/latihan/program-latihan", // Ganti dengan path Anda yang sebenarnya
    color: "from-orange-500 to-orange-700",
  },
  {
    title: "Sesi Latihan",
    description: "Kelola sesi-sesi latihan dalam setiap program.",
    icon: ClockIcon,
    path: "/latihan/latihan", // Ganti dengan path Anda yang sebenarnya
    color: "from-green-500 to-green-700",
  },
  {
    title: "Detail Latihan",
    description: "Atur detail setiap latihan seperti repetisi dan durasi.",
    icon: ListBulletIcon,
    path: "/latihan/detail-latihan", // Ganti dengan path Anda yang sebenarnya
    color: "from-red-500 to-red-700",
  },

];

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6 md:px-8">
      {/* --- Header --- */}
      <div className="mb-12">
        <Typography variant="h3" color="blue-gray" className="font-bold">
          Selamat Datang, Admin!
        </Typography>
        <Typography variant="paragraph" color="gray" className="mt-2 text-lg">
          Pilih salah satu menu di bawah ini untuk mulai mengelola data.
        </Typography>
      </div>

      {/* --- Grid Kartu Navigasi --- */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {adminPages.map(({ title, description, icon, path, color }) => (
          <Card
            key={title}
            shadow={true}
            className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            onClick={() => navigate(path)}
          >
            <CardBody className="p-6 flex flex-col h-full">
              {/* Icon dan Judul */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-tr ${color}`}>
                  {React.createElement(icon, {
                    className: "w-7 h-7 text-white",
                  })}
                </div>
                <Typography variant="h5" color="blue-gray" className="font-bold">
                  {title}
                </Typography>
              </div>

              {/* Deskripsi */}
              <Typography color="gray" className="mb-6 font-normal flex-grow">
                {description}
              </Typography>

              {/* Link Aksi */}
              <div className="mt-auto pt-4 border-t border-blue-gray-50">
                 <Typography
                    as="span"
                    variant="small"
                    color="blue"
                    className="font-semibold flex items-center gap-2 group"
                 >
                    Kelola Sekarang
                    <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                 </Typography>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Home;
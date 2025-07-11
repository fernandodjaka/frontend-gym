import {
  HomeIcon,
  UserCircleIcon,
  // TableCellsIcon,
  // InformationCircleIcon,
  // ServerStackIcon,
  // RectangleStackIcon,
  // ArrowRightOnRectangleIcon,
  // UserPlusIcon,
  // PencilIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, Register, IsiDataDiri } from "@/pages/auth";
// import { TujuanLatihan } from "@/pages/latihan";
import TujuanLatihan from "@/pages/latihan/tujuan_latian";
// import LandingPage from "./pages/auth/landingpage";
import ProgramLatihan from "./pages/latihan/program_latian";

import SesiLatihanAdminPage from "./pages/latihan/sesi_latihan";
import DetailLatihanAdminPage from "./pages/latihan/detail_latihan";
import AdminUsersPage from "./pages/dashboard/AdminUsersPage";







const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Data Pengguna",
        path: "/profile-users",
        element: <AdminUsersPage />,
      },
    ],
  },
  {

    layout: "latihan",
    title: "Latihan",
    pages: [
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Tujuan Latihan",
        path: "/tujuan-latihan",
        element: <TujuanLatihan />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Program Latihan",
        path: "/program-latihan",
        element: <ProgramLatihan />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Sesi Latihan",
        path: "/latihan",
        element: <SesiLatihanAdminPage />,
      },

      {
        icon: <UserCircleIcon {...icon} />,
        name: "Detail Latihan",
        path: "/detail-latihan",
        element: <DetailLatihanAdminPage />,
      },
    ],
  },
  
  // {
  //   layout: "auth",
  //   // title: "Autentikasi Pengguna",
  //   pages: [
  //     // {
  //     //   // icon: <ArrowRightOnRectangleIcon {...icon} />,
  //     //   // name: "Masuk",
  //     //   path: "/sign-in",
  //     //   element: <SignIn />,
  //     // },
  //     // {
  //     //   // icon: <UserPlusIcon {...icon} />,
  //     //   // name: "Daftar",
  //     //   path: "/landing-page",
  //     //   element: <LandingPage />,
  //     // },
  //     // {
  //     //   // icon: <PencilIcon {...icon} />,
  //     //   // name: "Lengkapi Profil",
  //     //   path: "/isi-data-diri",
  //     //   element: <IsiDataDiri />,
  //     // },

  //     // {
  //     //   // name: "Register",
  //     //   path: "/register",
  //     //   element: <Register />,
  //     // },
  //   ],
  // }

];

export default routes;

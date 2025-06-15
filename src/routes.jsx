import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp, Register, IsiDataDiri } from "@/pages/auth";
// import { TujuanLatihan } from "@/pages/latihan";
import TujuanLatihan from "@/pages/latihan/tujuan_latian";
import LandingPage from "./pages/auth/landingpage";
import ProgramLatihan from "./pages/latihan/program_latian";
import DetailLatihan from "./pages/latihan/detail_latihan";





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
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: "profile",
      //   path: "/profile",
      //   element: <Profile />,
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "tables",
      //   path: "/tables",
      //   element: <Tables />,
      // }
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "tujuan latihan",
      //   path: "/tujuan-latihan",
      //   element: <Tables />,
      // },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
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
        name: "Detail Latihan",
        path: "/detail-latihan",
        element: <DetailLatihan />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "LandingPAge",
        path: "/landing-page",
        element: <LandingPage />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "register",
        path: "/register",
        element: <Register />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "IsiDataDiri",
        path: "/isi-data-diri",
        element: <IsiDataDiri />,
      },
    ],
  }
];

export default routes;

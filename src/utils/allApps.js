import { lazy } from "react";

import driveAnimation from "../lottie/drive.json";
import formsAnimation from "../lottie/forms.json";
import translateAnimation from "../lottie/translate.json";
import mapsAnimation from "../lottie/maps.json";
import docsAnimation from "../lottie/docs.json";
import sheetsAnimation from "../lottie/sheets.json";

const Forms = lazy(() => import("../pages/forms"));
const Drive = lazy(() => import("../pages/drive"));
const Translate = lazy(() => import("../pages/translate"));
const Maps = lazy(() => import("../pages/maps"));
const Docs = lazy(() => import("../pages/docs"));
const Sheets = lazy(() => import("../pages/sheets"));

export const allApps = [
  {
    name: "Drive",
    route: "/drive",
    icon: "https://i.imgur.com/Cr3oZGy.png",
    component: Drive,
    animation: driveAnimation,
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, voluptas.",
  },
  {
    name: "Forms",
    route: "/forms",
    icon: "https://i.imgur.com/9Tf9BJU.png",
    component: Forms,
    animation: formsAnimation,
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, voluptas.",
  },
  {
    name: "Translate",
    route: "/translate",
    icon: "https://i.imgur.com/PAS1jhL.png",
    component: Translate,
    animation: translateAnimation,
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, voluptas.",
  },
  {
    name: "Maps",
    route: "/maps",
    icon: "https://i.imgur.com/bAnlNcp.png",
    component: Maps,
    animation: mapsAnimation,
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, voluptas.",
  },
  {
    name: "Docs",
    route: "/docs",
    icon: "https://i.imgur.com/6oRhxKL.png",
    component: Docs,
    animation: docsAnimation,
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, voluptas.",
  },
  {
    name: "Sheets",
    route: "/sheets",
    icon: "https://i.imgur.com/aHZnES8.png",
    component: Sheets,
    animation: sheetsAnimation,
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, voluptas.",
  },
];

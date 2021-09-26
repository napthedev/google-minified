import { lazy } from "react";

import driveAnimation from "../lottie/drive.json";
import formsAnimation from "../lottie/forms.json";
import translateAnimation from "../lottie/translate.json";
import mapsAnimation from "../lottie/maps.json";
import docsAnimation from "../lottie/docs.json";
import sheetsAnimation from "../lottie/sheets.json";
import meetAnimation from "../lottie/meet.json";

const Forms = lazy(() => import("../pages/forms"));
const Drive = lazy(() => import("../pages/drive"));
const Translate = lazy(() => import("../pages/translate"));
const Maps = lazy(() => import("../pages/maps"));
const Docs = lazy(() => import("../pages/docs"));
const Sheets = lazy(() => import("../pages/sheets"));
const Meet = lazy(() => import("../pages/meet"));

export const routes = [
  {
    name: "Drive",
    route: "/drive",
    icon: "https://i.imgur.com/Cr3oZGy.png",
    component: Drive,
    animation: driveAnimation,
    description: "Easy and secure access to all of your content",
  },
  {
    name: "Forms",
    route: "/forms",
    icon: "https://i.imgur.com/9Tf9BJU.png",
    component: Forms,
    animation: formsAnimation,
    description: "Create beautiful forms for your survey",
  },
  {
    name: "Translate",
    route: "/translate",
    icon: "https://i.imgur.com/PAS1jhL.png",
    component: Translate,
    animation: translateAnimation,
    description: "Translate your document with auto language detection",
  },
  {
    name: "Maps",
    route: "/maps",
    icon: "https://i.imgur.com/bAnlNcp.png",
    component: Maps,
    animation: mapsAnimation,
    description: "Explore and navigate your world through the map",
  },
  {
    name: "Docs",
    route: "/docs",
    icon: "https://i.imgur.com/6oRhxKL.png",
    component: Docs,
    animation: docsAnimation,
    description: "Free online document with realtime update",
  },
  {
    name: "Sheets",
    route: "/sheets",
    icon: "https://i.imgur.com/aHZnES8.png",
    component: Sheets,
    animation: sheetsAnimation,
    description: "Online spreadsheet to store your data",
  },
  {
    name: "Meet",
    route: "/meet",
    icon: "https://i.imgur.com/JmjLQvm.png",
    component: Meet,
    animation: meetAnimation,
    description: "Join your classes, meeting from anywhere",
  },
];

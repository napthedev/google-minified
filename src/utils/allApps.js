import { lazy } from "react";

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
  },
  {
    name: "Forms",
    route: "/forms",
    icon: "https://i.imgur.com/9Tf9BJU.png",
    component: Forms,
  },
  {
    name: "Translate",
    route: "/translate",
    icon: "https://i.imgur.com/PAS1jhL.png",
    component: Translate,
  },
  {
    name: "Maps",
    route: "/maps",
    icon: "https://i.imgur.com/7xyU04L.png",
    component: Maps,
  },
  {
    name: "Docs",
    route: "/docs",
    icon: "https://i.imgur.com/6oRhxKL.png",
    component: Docs,
  },
  {
    name: "Sheets",
    route: "/sheets",
    icon: "https://i.imgur.com/aHZnES8.png",
    component: Sheets,
  },
];

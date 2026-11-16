// src/store/Providers.tsx
"use client";
import { Provider } from "react-redux";
import axios from "axios";
import { APP_BASE_PATH } from "@/lib/deploymentPath";
import { store } from "./store";

axios.defaults.baseURL = APP_BASE_PATH;

export function Providers({children}: {children: React.ReactNode}) {
  return <Provider store={store}>{children}</Provider>;
};

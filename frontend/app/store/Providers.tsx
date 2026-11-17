// src/store/Providers.tsx
"use client";
import { Provider } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "@/lib/deploymentPath";
import { store } from "./store";

axios.defaults.baseURL = API_BASE_URL;

export function Providers({children}: {children: React.ReactNode}) {
  return <Provider store={store}>{children}</Provider>;
};

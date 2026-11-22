import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Site from "./Site";

const Admin = lazy(() => import("./admin/Admin"));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Site />} />
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<div style={{ padding: 40, color: "#8f9ab3" }}>Loading...</div>}>
            <Admin />
          </Suspense>
        }
      />
      <Route path="*" element={<Site />} />
    </Routes>
  );
}

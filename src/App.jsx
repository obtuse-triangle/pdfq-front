import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UploadPdf from "./components/fileUploadPage/UploadPdf";
import LandingPage from "./pages/LandingPage";
import Header from "./components/Header";
import Units from "./pages/units";
import Questions from "./pages/questions";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* 기본 경로를 /upload로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/upload" replace />} />
        {/* 파일 업로드 페이지 */}
        <Route path="/upload" element={<UploadPdf />} />
        {/* 랜딩 페이지 */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/units" element={<Units />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useState } from "react";
import Header from "./components/Header";
import UploadPdf from "./components/fileUploadPage/UploadPdf";

function App() {
  return (
    <>
      <Header />
      <UploadPdf />
    </>
  );
}

export default App;

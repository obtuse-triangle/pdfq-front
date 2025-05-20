import { useState } from "react";
import pdfqLogo from "/pdfq_logo.svg";

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 w-full">
        <img src={pdfqLogo} alt="PDFQ Logo" />
        <p>this is test</p>
        <h1 className="text-3xl font-bold text-gray-700">PDF uploader</h1>
      </div>
    </>
  );
}

export default App;

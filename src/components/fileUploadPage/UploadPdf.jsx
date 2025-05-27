import React, { useState } from "react";
import UploadBox from "./UploadBox";
import FeatureBoxes from "./FeatureBoxes";
import axios from "axios";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: "", // 프록시를 사용하므로 빈 문자열로 설정
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

function UploadPdf() {
  const [uploadState, setUploadState] = useState("idle");
  const [uploadError, setUploadError] = useState(null);

  const handleFileUpload = async (files) => {
    const fileToUpload = files[0];
    if (!fileToUpload) return;

    setUploadState("uploading");
    setUploadError(null);

    const filename = encodeURIComponent(fileToUpload.name);
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const response = await api.post(`/upload/${filename}.md`, formData);
      console.log("File upload successful!", response.data);
      setUploadState("success");
    } catch (error) {
      console.error("File upload failed:", error);
      let errorMessage = "파일 업로드 중 오류가 발생했습니다.";

      if (error.response) {
        // 서버에서 응답이 온 경우
        errorMessage = `서버 오류: ${error.response.status} - ${
          error.response.data || error.response.statusText
        }`;
      } else if (error.request) {
        // 요청은 보냈지만 응답이 없는 경우
        errorMessage =
          "서버로부터 응답이 없습니다. 서버가 실행 중인지 확인해주세요.";
      } else {
        // 요청 설정 중 오류가 발생한 경우
        errorMessage = `요청 오류: ${error.message}`;
      }

      setUploadError(errorMessage);
      setUploadState("error");
    }
  };

  const handleFileReadyForUpload = (validFiles) => {
    handleFileUpload(validFiles);
  };

  return (
    <>
      <section className="w-[1440px] h-full flex justify-center items-center mt-[50px]">
        <div className="w-[1120px] inline-flex flex-col justify-start items-center gap-20">
          <div className="self-stretch flex flex-col justify-start items-center gap-10">
            <div className="flex flex-col justify-start items-center gap-2.5">
              <div className="w-[474px] text-center justify-start text-Black text-3xl font-medium font-['Pretendard'] leading-nomal">
                Upload your File to start learning
              </div>
              <div className="w-[632px] text-center justify-start text-Black text-xl font-normal font-['Pretendard'] leading-normal">
                you can upload pdf, markdown, html file. maximum size is 15Mb
              </div>
            </div>
            <UploadBox onFileUpload={handleFileReadyForUpload} />
          </div>
          <FeatureBoxes />
        </div>
      </section>
    </>
  );
}

export default UploadPdf;

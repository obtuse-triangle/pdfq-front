import React, { useState } from "react";
import UploadBox from "./UploadBox";
import FeatureBoxes from "./FeatureBoxes";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: "https://pdfqb.obtuse.kr",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

function UploadPdf() {
  const [uploadError, setUploadError] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = async (files) => {
    const fileToUpload = files[0];
    if (!fileToUpload) return;

    setUploadError(null);

    // 파일 정보 로깅
    console.log("File details:", {
      name: fileToUpload.name,
      type: fileToUpload.type,
      size: fileToUpload.size,
      lastModified: fileToUpload.lastModified,
    });

    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      // 파일 업로드 요청
      const response = await api.post(
        `api/upload/${encodeURIComponent(fileToUpload)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // 업로드 진행 상황 모니터링
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          },
        }
      );

      console.log("File upload successful!", response.data);

      // 서버에서 처리 ID를 받았다고 가정
      const processId = response.data.processId;

      // 업로드 성공 시 Units 페이지로 이동
      navigate("/units", {
        state: {
          fileName: fileToUpload.name,
          fileUrl: response.data.fileUrl,
          uploadTime: new Date().toISOString(),
          processId: processId,
          status: "success", // 업로드 상태 추가
        },
        replace: true, // 브라우저 히스토리에 현재 페이지를 남기지 않음
      });
    } catch (error) {
      console.error("File upload failed:", error);
      let errorMessage = "파일 업로드 중 오류가 발생했습니다.";

      if (error.response) {
        // 서버 응답이 있는 경우
        const { status, data } = error.response;
        errorMessage = `서버 오류 (${status}): ${
          data?.message || error.response.statusText
        }`;
        console.error("Server response:", data);
      } else if (error.request) {
        // 요청은 보냈지만 응답이 없는 경우
        errorMessage =
          "서버로부터 응답이 없습니다. 서버가 실행 중인지 확인해주세요.";
        console.error("No response received:", error.request);
      } else {
        // 요청 설정 중 오류가 발생한 경우
        errorMessage = `요청 오류: ${error.message}`;
        console.error("Request error:", error.message);
      }

      setUploadError(errorMessage);
      alert(errorMessage);
    }
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
            <UploadBox onFileUpload={handleFileUpload} />
            {uploadError && (
              <div className="text-red-500 mt-4">{uploadError}</div>
            )}
          </div>
          <FeatureBoxes />
        </div>
      </section>
    </>
  );
}

export default UploadPdf;

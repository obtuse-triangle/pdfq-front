import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: "https://pdfqb.obtuse.kr",
});

function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { fileName, fileUrl, uploadTime, processId } = location.state || {};
  const [processingStep, setProcessingStep] = useState(1);
  const [processingStatus, setProcessingStatus] = useState({
    reading: false,
    splitting: false,
  });

  // state가 없는 경우 업로드 페이지로 리다이렉트
  useEffect(() => {
    if (!location.state) {
      navigate("/upload");
    }
  }, [location.state, navigate]);

  // 서버에서 처리 상태 확인
  useEffect(() => {
    if (!processId) return;

    const checkProcessingStatus = async () => {
      try {
        const response = await api.get(`/api/process-status/${processId}`);
        const { status } = response.data;

        // 서버 응답에 따라 처리 상태 업데이트
        setProcessingStatus({
          reading: status === "reading" || status === "splitting" || status === "completed",
          splitting: status === "splitting" || status === "completed",
        });

        // 처리 완료 시 다음 단계로
        if (status === "completed") {
          // 필요한 경우 추가 작업 수행
        }
      } catch (error) {
        console.error("처리 상태 확인 중 오류:", error);
      }
    };

    // 주기적으로 상태 확인
    const intervalId = setInterval(checkProcessingStatus, 5000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, [processId]);

  if (!location.state) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* 파일 처리 상태 표시 */}
            <div className="w-full max-w-md">
              <div className="bg-gray-100 rounded-lg p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      processingStatus.reading ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                  <span
                    className={`text-lg ${
                      processingStatus.reading ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    Reading file...
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      processingStatus.splitting ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                  <span
                    className={`text-lg ${
                      processingStatus.splitting ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    Splitting Chapters...
                  </span>
                </div>
              </div>
            </div>

            {/* 파일 정보 */}
            <div className="w-full max-w-md text-center">
              <h2 className="text-lg font-medium text-gray-900">파일 정보</h2>
              <p className="mt-2 text-gray-600">파일명: {fileName}</p>
              <p className="text-gray-600">업로드 시간: {new Date(uploadTime).toLocaleString()}</p>
            </div>

            {/* 다음 단계 버튼 */}
            <div className="w-full max-w-md space-y-4">
              <button
                onClick={() => window.open(fileUrl, "_blank")}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                파일 보기
              </button>
              <button
                onClick={() => navigate("/upload")}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                다른 파일 업로드하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

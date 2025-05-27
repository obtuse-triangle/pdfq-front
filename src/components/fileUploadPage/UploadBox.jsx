import { useRef, useState } from "react";
import filePlus from "../../assets/section/file-plus.svg";

function UploadBox({ onFileUpload }) {
  const fileInputRef = useRef(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false); // 드래그 중 상태 관리
  const [processingStep, setProcessingStep] = useState(0); // 0: 대기, 1: 업로드 중, 2: 리딩, 3: 스플리팅

  // 허용되는 파일 형식
  const allowedFileTypes = [
    "text/markdown",
    "text/html",
    ".md",
    ".markdown",
    ".html",
    ".htm",
  ];

  const MAX_FILE_SIZE_MB = 15;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // 15MB를 바이트로 변환

  // 파일 선택 또는 드래그 드롭으로 파일을 받았을 때 처리하는 함수
  const processFiles = (files) => {
    if (files.length === 0) return;

    const validFiles = Array.from(files).filter((file) => {
      // 크기 제한 확인
      if (file.size > MAX_FILE_SIZE_BYTES) {
        console.log(
          `파일 크기 초과: ${file.name} (${(file.size / (1024 * 1024)).toFixed(
            2
          )} MB)`
        );
        return false; // 크기 초과 시 무효 처리
      }

      // MIME 타입 확인
      const isMimeTypeAllowed = allowedFileTypes.includes(file.type);
      // 확장자 확인 (MIME 타입이 없거나 불확실할 경우 대비)
      const fileExtension = "." + file.name.split(".").pop().toLowerCase();
      const isExtensionAllowed = allowedFileTypes.includes(fileExtension);

      return isMimeTypeAllowed || isExtensionAllowed;
    });

    if (validFiles.length > 0 && validFiles.length === files.length) {
      // 모든 파일이 유효한 경우
      console.log("유효한 파일 선택됨:", validFiles);
      // 파일 업로드 시작
      setProcessingStep(1);

      // 파일 처리 시뮬레이션
      setTimeout(() => {
        setProcessingStep(2); // 리딩 단계
        setTimeout(() => {
          setProcessingStep(3); // 스플리팅 단계
          setTimeout(() => {
            // 실제 파일 업로드 처리
            if (onFileUpload) {
              onFileUpload(validFiles);
            }
          }, 1000);
        }, 1500);
      }, 1000);
    } else {
      // 유효하지 않은 파일이 있거나 크기 제한 초과 파일이 있는 경우
      console.log("허용되지 않는 파일 형식 또는 크기 초과");
      alert(`Invalid file format or file size exceeds ${MAX_FILE_SIZE_MB}MB.`);
    }
  };

  // 클릭하여 파일 선택 대화상자 열기
  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  // <input type="file"> 변경 이벤트 핸들러
  const handleFileChange = (event) => {
    const files = event.target.files;
    processFiles(files);
  };

  // 드래그 중인 요소가 대상 위로 올라왔을 때
  const handleDragOver = (event) => {
    event.preventDefault(); // 기본 동작 방지 (파일 열림 방지)
    setIsDraggingOver(true);
  };

  // 드래그 중인 요소가 대상을 벗어났을 때
  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
  };

  // 드롭 이벤트 핸들러
  const handleDrop = (event) => {
    event.preventDefault(); // 기본 동작 방지
    setIsDraggingOver(false);
    const files = event.dataTransfer.files;
    processFiles(files);
  };

  return (
    <div
      data-property="default"
      className={`w-[1120px] h-64 flex flex-col justify-start items-center gap-5 cursor-pointer ${
        isDraggingOver ? "border-blue-500 bg-blue-100" : ""
      }`}
      onClick={handleDivClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 숨겨진 파일 입력 요소 */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".md,.markdown,.html,.htm" // 허용할 파일 형식 지정
      />

      <div className="self-stretch h-64 relative bg-[#80BFFF] rounded-lg overflow-hidden">
        <div
          className={`w-[1080px] h-56 left-[20px] top-[20px] absolute rounded-lg border-2 border-dotted ${
            isDraggingOver ? "border-blue-500" : "border-white"
          } inline-flex flex-col justify-center items-center gap-5`}
        >
          {processingStep === 0 ? (
            <>
              <div className="w-16 h-16 relative overflow-hidden">
                <img src={filePlus} alt="file-plus" />
              </div>
              <div className="text-white self-stretch text-center justify-start text-White text-2xl font-medium font-['Pretendard'] leading-7">
                Upload your file here
              </div>
              <div
                data-color="primary"
                data-icon="none"
                data-property="default"
                data-size="small"
                data-style="default"
                className="h-9 px-3.5 py-1 bg-[#1A8CFF] rounded inline-flex justify-center items-center gap-2.5"
              >
                <button className="text-white text-center justify-start text-White text-base font-normal font-['Pretendard'] leading-tight">
                  Select File
                </button>
              </div>
            </>
          ) : processingStep === 1 ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {/* 외부 원 */}
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                {/* 회전하는 원 */}
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                {/* 중앙 점 */}
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <span className="text-white text-lg font-medium">
                Uploading file...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-6 w-full max-w-md">
                {processingStep === 2 && (
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                      <div className="absolute top-0 left-0 w-3 h-3 rounded-full bg-blue-500 animate-ping opacity-75"></div>
                    </div>
                    <span className="text-white text-lg">Reading file...</span>
                  </div>
                )}
                {processingStep === 3 && (
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                      <div className="absolute top-0 left-0 w-3 h-3 rounded-full bg-blue-500 animate-ping opacity-75"></div>
                    </div>
                    <span className="text-white text-lg">
                      Splitting Chapters...
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadBox;

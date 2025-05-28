import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyFiles() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFiles, setExpandedFiles] = useState({});

  useEffect(() => {
    // API를 통해 파일 목록을 가져오는 함수
    const fetchFiles = async () => {
      try {
        // 실제 API 엔드포인트에 맞게 수정 필요
        const response = await axios.get("https://pdfqb.obtuse.kr/api/files");
        setFiles(response.data);
      } catch (error) {
        console.error("파일 목록을 가져오는데 실패했습니다:", error);
        // 임시 데이터로 대체 (실제 구현에서는 제거)
        setFiles([
          {
            id: 1,
            name: "PDF name 1",
            progress: 12,
            completedUnits: 0,
            totalUnits: 4,
            completedLessons: 2,
            totalLessons: 17,
            fileName: "pdf_name_1.pdf",
          },
          {
            id: 2,
            name: "PDF name 2",
            progress: 0,
            completedUnits: 0,
            totalUnits: 4,
            completedLessons: 0,
            totalLessons: 17,
            fileName: "pdf_name_2.pdf",
          },
          {
            id: 3,
            name: "PDF name 3",
            progress: 0,
            completedUnits: 0,
            totalUnits: 4,
            completedLessons: 0,
            totalLessons: 17,
            fileName: "pdf_name_3.pdf",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const toggleExpand = (fileId) => {
    setExpandedFiles((prev) => ({
      ...prev,
      [fileId]: !prev[fileId],
    }));
  };

  const handleGoToUnits = (file) => {
    navigate("/units", {
      state: {
        fileName: file.fileName,
        fileId: file.id,
      },
    });
  };

  const handleImportantProblems = (file) => {
    navigate("/important-problems", {
      state: {
        fileName: file.fileName,
        fileId: file.id,
      },
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading files...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
            ←
          </button>
          <div className="text-lg font-medium">My files</div>
        </div>
        <div className="flex gap-4">
          <button className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-200 rounded bg-gray-100">
            My files
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
          >
            Upload file
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">My files</h1>
          <div className="text-gray-600">
            <p>You can check the contents of the file you uploaded,</p>
            <p>or solve the saved important problems.</p>
          </div>
        </div>

        {/* Files List */}
        <div className="space-y-6">
          {files.map((file) => (
            <div key={file.id} className="bg-white rounded-lg shadow-sm border">
              {/* File Header */}
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-medium">{file.name}</h3>
                  <span className="text-sm text-gray-500">
                    {file.progress}% completed
                  </span>
                </div>
                <button
                  onClick={() => toggleExpand(file.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      expandedFiles[file.id] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Expanded Content */}
              {expandedFiles[file.id] && (
                <div className="px-6 pb-6">
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                      Learning progress: {file.progress}%
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
                      {file.completedUnits}/{file.totalUnits} Units,{" "}
                      {file.completedLessons}/{file.totalLessons} Lessons
                      completed
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleImportantProblems(file)}
                      className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors text-sm"
                    >
                      Important problems
                    </button>
                    <button
                      onClick={() => handleGoToUnits(file)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                      Go to Units
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {files.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No files uploaded yet</div>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition-colors"
            >
              Upload your first file
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyFiles;

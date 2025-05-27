import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Units() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const data = state.data;

  // state가 없으면 업로드 페이지로 리다이렉트
  React.useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  if (!state) {
    return null; // 리다이렉트 중에는 아무것도 렌더링하지 않음
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center mt-20">
      <h1 className="text-2xl font-bold mb-4">Upload Completed</h1>
      <div className="mb-2">
        <b>file:</b> {state.fileName}
      </div>
      <div className="mb-2">
        <b>upload time:</b> {state.uploadTime}
      </div>

      <div className="mb-2">
        <b>Table of Contents:</b>
        <ul className="list-disc ml-6">
          {data.chapters.map((chapter: any, idx: number) => {
            const [open, setOpen] = React.useState(false);
            // 각 챕터별로 상태를 관리하기 위해 컴포넌트 분리
            const ChapterItem = () => {
              const [isOpen, setIsOpen] = React.useState(false);
              return (
                <li key={chapter.title + idx} className="mb-2">
                  <button
                    type="button"
                    className="font-semibold text-left w-full"
                    onClick={() => setIsOpen((v) => !v)}
                  >
                    {chapter.title} {isOpen ? "▲" : "▼"}
                  </button>
                  {isOpen && (
                    <ul className="list-disc ml-6 mt-1">
                      {chapter.sections.map((section: any, sidx: number) => (
                        <li key={section.title + sidx}>
                          <a
                            href="#"
                            className="text-blue-600 underline"
                            onClick={(e) => {
                              e.preventDefault();
                              // 문제 페이지로 이동 (예: /questions?chapter=...&section=...)
                              navigate(
                                `/questions?chapter=${encodeURIComponent(
                                  chapter.title
                                )}&section=${encodeURIComponent(section.title)}`,
                                { state: { chapter, section, ...state } }
                              );
                            }}
                          >
                            {section.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            };
            return <ChapterItem key={chapter.title + idx} />;
          })}
        </ul>
      </div>
    </div>
  );
}

export default Units;

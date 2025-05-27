import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Questions() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const chapterTitle = searchParams.get("chapter");
  const sectionTitle = searchParams.get("section");
  const state = location.state;
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [userAnswers, setUserAnswers] = React.useState({}); // { idx: [선택값] }
  const [showResult, setShowResult] = React.useState({}); // { idx: true/false }
  const api = axios.create({
    baseURL: "https://pdfqb.obtuse.kr",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  React.useEffect(() => {
    // 파라미터가 없으면 units로 리다이렉트
    if (!chapterTitle || !sectionTitle) {
      navigate("/units", { replace: true });
    }
    console.log("state:", state);
    if (
      state &&
      state.chapter &&
      state.section &&
      state.chapter.title === chapterTitle &&
      state.section.title === sectionTitle
    ) {
      const sectionObj = state.chapter.sections.find((sec: any) => sec.title === sectionTitle);
      if (sectionObj && Array.isArray(sectionObj.question) && sectionObj.question.length === 0) {
        // questions가 비어있음
        api
          .post(`api/files/${state.fileName.split(".")[0]}/questions`, sectionTitle, {
            headers: {
              "Content-Type": "text/plain",
            },
          })
          .then((res) => {
            // 응답 데이터 타입: [{ question, answer_type, choices, multi_select, difficulty, answer }, ...]
            setQuestions(res.data);
          })
          .catch((err) => {
            alert("문제 요청에 실패했습니다.");
            console.error(err);
          });
      } else if (
        sectionObj &&
        Array.isArray(sectionObj.question) &&
        sectionObj.question.length > 0
      ) {
        setQuestions(sectionObj.question);
      }
    }
  }, [chapterTitle, sectionTitle, navigate]);

  if (!chapterTitle || !sectionTitle) {
    return null; // 리다이렉트 중에는 아무것도 렌더링하지 않음
  }

  const handleSelect = (qIdx, choiceIdx, multi) => {
    setUserAnswers((prev) => {
      if (multi) {
        const prevArr = prev[qIdx] || [];
        if (prevArr.includes(choiceIdx)) {
          return { ...prev, [qIdx]: prevArr.filter((v) => v !== choiceIdx) };
        } else {
          return { ...prev, [qIdx]: [...prevArr, choiceIdx] };
        }
      } else {
        return { ...prev, [qIdx]: [choiceIdx] };
      }
    });
  };

  const handleSubmit = (qIdx) => {
    setShowResult((prev) => ({ ...prev, [qIdx]: true }));
  };

  const scrollToNext = (idx) => {
    const next = document.getElementById(`question-${idx + 1}`);
    if (next) next.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start mt-20">
      <h1 className="text-2xl font-bold mb-4">Questions</h1>
      <div className="bg-gray-100 p-6 rounded shadow-md w-[400px] mb-8">
        <div className="mb-2">
          <b>chapter:</b> {chapterTitle}
        </div>
        <div className="mb-2">
          <b>section:</b> {sectionTitle}
        </div>
      </div>
      <div className="w-full max-w-xl flex flex-col gap-8">
        {Array.isArray(questions) &&
          questions.map((q, idx) => {
            const userAns = userAnswers[idx] || [];
            const isMulti = q.multi_select;
            const isShow = showResult[idx];
            let isCorrect = false;
            if (isShow) {
              if (isMulti) {
                isCorrect = Array.isArray(q.answer)
                  ? JSON.stringify([...userAns].sort()) === JSON.stringify([...q.answer].sort())
                  : false;
              } else {
                isCorrect = Array.isArray(q.answer)
                  ? q.answer.includes(userAns[0])
                  : userAns[0] === q.answer;
              }
            }
            return (
              <div key={idx} id={`question-${idx}`} className="">
                <div className="mb-2 font-semibold">
                  Q{idx + 1}. {q.question}
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  {q.choices.map((choice, cidx) => (
                    <label
                      key={cidx}
                      className={`flex items-center gap-2 cursor-pointer ${
                        isShow
                          ? isMulti
                            ? Array.isArray(q.answer) && q.answer.includes(cidx)
                              ? "font-bold"
                              : ""
                            : q.answer === cidx
                            ? "font-bold"
                            : ""
                          : ""
                      }`}
                    >
                      <input
                        type={isMulti ? "checkbox" : "radio"}
                        name={`q${idx}`}
                        value={cidx}
                        checked={userAns.includes(cidx)}
                        disabled={isShow}
                        onChange={() => handleSelect(idx, cidx, isMulti)}
                      />
                      {choice}
                    </label>
                  ))}
                </div>
                {!isShow && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => {
                      handleSubmit(idx);
                      setTimeout(() => scrollToNext(idx), 300);
                    }}
                    disabled={userAns.length === 0}
                  >
                    Submit
                  </button>
                )}
                {isShow && (
                  <div
                    className={`mt-4 font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}
                  >
                    {isCorrect ? "Correct!" : "Incorrect."}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Questions;

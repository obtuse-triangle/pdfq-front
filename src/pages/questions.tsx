import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProgress } from "../hook/useProgress";

function Questions() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const chapterTitle = searchParams.get("chapter");
  const sectionTitle = searchParams.get("section");
  const state = location.state;

  const [questions, setQuestions] = React.useState([]);
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [userAnswers, setUserAnswers] = React.useState({});
  const [showResult, setShowResult] = React.useState({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = React.useState({});

  const { markLessonComplete } = useProgress(state?.fileName, state?.chapter ? [state.chapter] : []);

  const chapterIndex = state?.chapterIndex;
  const sectionIndex = state?.sectionIndex;

  React.useEffect(() => {
    if (!chapterTitle || !sectionTitle) {
      navigate("/units", { replace: true });
    }

    const sectionObj = state?.chapter?.sections?.find((sec) => sec.title === sectionTitle);

    if (sectionObj?.question?.length > 0) {
      setQuestions(sectionObj.question);
    } else {
      axios
        .post(
          `https://pdfqb.obtuse.kr/api/files/${state.fileName.split(".")[0]}/questions`,
          sectionTitle,
          {
            headers: {
              "Content-Type": "text/plain",
            },
          }
        )
        .then((res) => setQuestions(res.data))
        .catch((err) => {
          alert("문제 요청 실패");
          console.error(err);
        });
    }
  }, [chapterTitle, sectionTitle, navigate]);

  const handleSelect = (qIdx, choiceIdx, multi) => {
    setUserAnswers((prev) => {
      const prevArr = prev[qIdx] || [];
      if (multi) {
        return {
          ...prev,
          [qIdx]: prevArr.includes(choiceIdx)
            ? prevArr.filter((v) => v !== choiceIdx)
            : [...prevArr, choiceIdx],
        };
      } else {
        return { ...prev, [qIdx]: [choiceIdx] };
      }
    });
  };

  const handleMarkImportant = () => {
    setBookmarkedQuestions(prev => ({
      ...prev,
      [currentIdx]: !prev[currentIdx]
    }));
  };

  const handleDontKnow = () => {
    setShowResult((prev) => ({ ...prev, [currentIdx]: true }));
    
    // 모든 문제가 완료되었는지 확인 (현재 문제 포함)
    const totalAnswered = Object.keys(showResult).length + 1; // +1은 현재 문제
    const isAllCompleted = totalAnswered === questions.length;

    if (isAllCompleted) {
      // 모든 문제를 다 풀었을 때 완료 처리
      markLessonComplete?.(chapterIndex, sectionIndex);
    }
  };

  const handleCheckAnswer = () => {
    setShowResult((prev) => ({ ...prev, [currentIdx]: true }));

    // 모든 문제가 완료되었는지 확인 (현재 문제 포함)
    const totalAnswered = Object.keys(showResult).length + 1; // +1은 현재 문제
    const isAllCompleted = totalAnswered === questions.length;

    if (isAllCompleted) {
      // 모든 문제를 다 풀었을 때 완료 처리
      markLessonComplete?.(chapterIndex, sectionIndex);
    }
  };

  const goToNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const goToPrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading questions...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const userAns = userAnswers[currentIdx] || [];
  const isMulti = currentQuestion.multi_select;
  const isShow = showResult[currentIdx];
  const isBookmarked = bookmarkedQuestions[currentIdx];
  const isCorrect = isShow
    ? isMulti
      ? JSON.stringify([...userAns].sort()) === JSON.stringify([...currentQuestion.answer].sort())
      : userAns[0] === currentQuestion.answer
    : false;

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
            ←
          </button>
          <div className="text-sm text-gray-600">
            Units / {chapterTitle} / Practice
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/api/files')}
            className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-200 rounded"
          >
            My files
          </button>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
          >
            Upload file
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="text-center py-8">
        <div className="text-2xl font-semibold text-blue-500 mb-2">
          {currentIdx + 1}/10
        </div>
      </div>

      {/* Question */}
      <div className="text-xl font-medium mb-8 text-center">
            {currentQuestion.question}
      </div>
      {/* Question Card */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-8">

          {/* Choices */}
          <div className="space-y-3 mb-8">
            {currentQuestion.choices && currentQuestion.choices.map((choice, cidx) => {
              const isSelected = userAns.includes(cidx);
              const isCorrectChoice = isShow && (
                isMulti 
                  ? currentQuestion.answer.includes(cidx)
                  : currentQuestion.answer === cidx
              );
              const isWrongChoice = isShow && isSelected && !isCorrectChoice;

              return (
                <label 
                  key={cidx} 
                  className={`
                    flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors
                    ${isShow 
                      ? isCorrectChoice 
                        ? 'border-green-500 bg-green-50' 
                        : isWrongChoice 
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                      : isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }
                    ${isShow ? 'cursor-default' : 'cursor-pointer'}
                  `}
                >
                  <input
                    type={isMulti ? "checkbox" : "radio"}
                    name={`q${currentIdx}`}
                    value={cidx}
                    checked={isSelected}
                    disabled={isShow}
                    onChange={() => handleSelect(currentIdx, cidx, isMulti)}
                    className="w-4 h-4"
                  />
                  <span className="flex-1 text-left">{choice}</span>
                  {isShow && isCorrectChoice && (
                    <span className="text-green-600 font-semibold">✓</span>
                  )}
                  {isShow && isWrongChoice && (
                    <span className="text-red-600 font-semibold">✗</span>
                  )}
                </label>
              );
            })}
          </div>

          {/* Action Buttons */}
          {!isShow ? (
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDontKnow}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Don't know
              </button>
              <button
                onClick={handleCheckAnswer}
                disabled={userAns.length === 0}
                className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check answer
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className={`text-xl font-bold mb-6 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {isCorrect ? "Correct!" : "Incorrect."}
              </div>
              
              {/* Mark as Important */}
              <button 
                onClick={handleMarkImportant}
                className={`flex items-center gap-2 mx-auto mb-6 transition-colors ${
                  isBookmarked 
                    ? 'text-yellow-600 hover:text-yellow-700' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="text-lg">{isBookmarked ? '★' : '⊕'}</span>
                {isBookmarked ? 'Marked as Important' : 'Mark as Important'}
              </button>

              {/* Navigation */}
              <div className="flex gap-4 justify-center">
                {currentIdx > 0 && (
                  <button
                    onClick={goToPrev}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ← Previous
                  </button>
                )}
                {currentIdx < questions.length - 1 && (
                  <button
                    onClick={goToNext}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Next →
                  </button>
                )}
                {currentIdx === questions.length - 1 && (
                  <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Questions;
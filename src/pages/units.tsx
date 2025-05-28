import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProgress } from "../hook/useProgress"; // 커스텀 훅 import

function Units() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const data = state?.data;

  // 커스텀 훅 사용
  const {
    totalChapters,
    totalLessons,
    completedLessonCount,
    progressPercentage,
    markLessonComplete,
    getNextIncompleteLesson,
    isLessonCompleted,
    isUnitCompleted,
    getUnitProgress
  } = useProgress(state?.fileName, data?.chapters || []);

  // state가 없으면 업로드 페이지로 리다이렉트
  React.useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  if (!state || !data) {
    return null;
  }

  // Start practice 버튼 클릭 핸들러
  const handleStartPractice = () => {
    const nextLesson = getNextIncompleteLesson();
    if (nextLesson) {
      navigate(
        `/questions?chapter=${encodeURIComponent(
          nextLesson.chapter.title
        )}&section=${encodeURIComponent(nextLesson.section.title)}`,
        { 
          state: { 
            chapter: nextLesson.chapter, 
            section: nextLesson.section, 
            chapterIndex: nextLesson.chapterIndex,
            sectionIndex: nextLesson.sectionIndex,
            markLessonComplete,
            ...state 
          } 
        }
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* 메인 컨텐츠를 화면 가운데에 위치 */}
      <div className="flex justify-center relative z-10">
        <div className="w-[1040px] px-20 pt-14 pb-28 bg-white inline-flex flex-col justify-start items-start gap-14">
          <div className="self-stretch flex flex-col justify-start items-start gap-10">
            <div className="flex flex-col justify-start items-start gap-5">
              <div className="self-stretch inline-flex justify-start items-center gap-1">
                <div className="justify-start text-black text-3xl font-medium font-['Pretendard'] leading-loose">Learning progress:</div>
                <div className="justify-start text-black text-3xl font-medium font-['Pretendard'] leading-loose">{progressPercentage}%</div>
              </div>
              <div className="justify-start text-black text-xl font-normal font-['Pretendard'] leading-normal">
                {data.chapters.filter((_, idx) => isUnitCompleted(idx)).length}/{totalChapters} Units completed, {completedLessonCount}/{totalLessons} Lessons completed
              </div>
            </div>
            <div data-progress={`${progressPercentage}%`} data-size="large" className="w-[880px] h-2.5 relative bg-gray-100 rounded-[10px] overflow-hidden">
              <div className="h-2.5 left-0 top-0 absolute bg-blue-500 rounded-[10px] transition-all duration-300" style={{width: `${(progressPercentage / 100) * 880}px`}} />
            </div>
            <div 
              data-color="primary" 
              data-icon="none" 
              data-property="default" 
              data-size="small" 
              data-style="default" 
              className={`w-[880px] h-12 px-3.5 py-1 rounded inline-flex justify-center items-center gap-2.5 cursor-pointer transition-colors ${
                getNextIncompleteLesson() 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={handleStartPractice}
            >
              <div className="text-center justify-start text-white text-xl font-medium font-['Pretendard'] leading-normal">
                {getNextIncompleteLesson() ? 'Start practice' : 'All lessons completed!'}
              </div>
            </div>
          </div>
          
          <div className="self-stretch flex flex-col justify-start items-start gap-10">
            {data.chapters.map((chapter, idx) => {
              const ChapterItem = () => {
                const [isOpen, setIsOpen] = React.useState(false);
                const unitProgress = getUnitProgress(idx);
                const isCompleted = isUnitCompleted(idx);
                
                return (
                  <div key={chapter.title + idx} data-property={isOpen ? "opened" : "default"} className="w-[880px] flex flex-col justify-start items-start">
                    <div 
                      data-property={isOpen ? "opened" : "default"} 
                      className={`self-stretch h-14 pl-7 pr-5 bg-white rounded outline outline-1 outline-offset-[-1px] outline-gray-100 inline-flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors ${isCompleted ? 'bg-green-50' : ''}`}
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <div className="flex justify-start items-center gap-5">
                        <div className="justify-start text-black text-2xl font-medium font-['Pretendard'] leading-7">
                          {chapter.title}
                          {isCompleted && (
                            <span className="ml-2 text-green-600">✓</span>
                          )}
                        </div>
                        <div className="flex justify-start items-center">
                          <div className="justify-start text-gray-400 text-xl font-normal font-['Pretendard'] leading-normal">{unitProgress.completed}</div>
                          <div className="justify-start text-gray-400 text-xl font-normal font-['Pretendard'] leading-normal">/</div>
                          <div className="justify-start text-gray-400 text-xl font-normal font-['Pretendard'] leading-normal">{unitProgress.total}</div>
                          <div className="justify-start text-gray-400 text-xl font-normal font-['Pretendard'] leading-normal"> Lesson completed</div>
                        </div>
                      </div>
                      <div className="w-6 h-6 relative overflow-hidden">
                        <div className={`w-3 h-1.5 left-[6px] top-[9px] absolute outline outline-2 outline-offset-[-1px] outline-black transform transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`} />
                      </div>
                    </div>
                    
                    {isOpen && (
                      <div data-count={unitProgress.total} className="self-stretch rounded outline outline-1 outline-offset-[-1px] outline-gray-100 flex flex-col justify-start items-start overflow-hidden">
                        {chapter.sections.map((section, sidx) => {
                          const lessonCompleted = isLessonCompleted(idx, sidx);
                          
                          return (
                            <div 
                              key={section.title + sidx}
                              data-property={lessonCompleted ? "completed" : "default"} 
                              className={`self-stretch h-14 px-7 py-2.5 bg-white border-b border-gray-100 flex flex-col justify-center items-center gap-2.5 cursor-pointer hover:bg-gray-50 transition-colors ${lessonCompleted ? 'bg-green-50' : ''}`}
                              onClick={() => {
                                navigate(
                                  `/questions?chapter=${encodeURIComponent(
                                    chapter.title
                                  )}&section=${encodeURIComponent(section.title)}`,
                                  { 
                                    state: { 
                                      chapter, 
                                      section, 
                                      chapterIndex: idx,
                                      sectionIndex: sidx,
                                      // markLessonComplete,
                                      ...state 
                                    } 
                                  }
                                );
                              }}
                            >
                              <div className="self-stretch inline-flex justify-start items-center gap-3">
                                <div className="justify-start text-black text-xl font-normal font-['Pretendard'] leading-normal">
                                  Lesson {sidx + 1} - {section.title}
                                </div>
                                {lessonCompleted && (
                                  <div className="w-6 h-6 relative overflow-hidden">
                                    <div className="w-5 h-5 left-[2px] top-[2px] absolute bg-green-500 outline outline-2 outline-offset-[-1px] outline-white rounded-full flex items-center justify-center">
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              };
              
              return <ChapterItem key={chapter.title + idx} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Units;
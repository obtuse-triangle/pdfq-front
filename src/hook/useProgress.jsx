import { useState, useEffect, useCallback } from "react";

/**
 * 학습 진행상황을 관리하는 커스텀 훅
 * @param {string} fileName - 파일명 (진행상황 저장 키로 사용)
 * @param {Array} chapters - 챕터 데이터 배열
 * @returns {Object} 진행상황 관련 상태와 함수들
 */
export const useProgress = (fileName, chapters = []) => {
  const [completedLessons, setCompletedLessons] = useState({});
  const [completedUnits, setCompletedUnits] = useState([]);

  // localStorage에서 진행상황 불러오기
  useEffect(() => {
    if (fileName) {
      const savedProgress = localStorage.getItem(`progress_${fileName}`);
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress);
          setCompletedLessons(progress.completedLessons || {});
          setCompletedUnits(progress.completedUnits || []);
        } catch (error) {
          console.error("Progress 데이터 파싱 오류:", error);
        }
      }
    }
  }, [fileName]);

  // localStorage에 진행상황 저장
  const saveProgress = useCallback(
    (newCompletedLessons, newCompletedUnits) => {
      if (fileName) {
        const progress = {
          completedLessons: newCompletedLessons,
          completedUnits: newCompletedUnits,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(`progress_${fileName}`, JSON.stringify(progress));
      }
    },
    [fileName]
  );

  // 레슨 완료 처리
  const markLessonComplete = useCallback(
    (chapterIndex, sectionIndex) => {
      const lessonKey = `${chapterIndex}-${sectionIndex}`;

      setCompletedLessons((prev) => {
        const newCompletedLessons = { ...prev, [lessonKey]: true };

        // 해당 유닛의 모든 레슨이 완료되었는지 확인
        if (chapters[chapterIndex]) {
          const chapter = chapters[chapterIndex];
          const allLessonsCompleted = chapter.sections.every(
            (_, idx) => newCompletedLessons[`${chapterIndex}-${idx}`]
          );

          setCompletedUnits((prevUnits) => {
            let newCompletedUnits = [...prevUnits];
            if (allLessonsCompleted && !prevUnits.includes(chapterIndex)) {
              newCompletedUnits.push(chapterIndex);
            }

            // localStorage에 저장
            saveProgress(newCompletedLessons, newCompletedUnits);
            return newCompletedUnits;
          });
        } else {
          saveProgress(newCompletedLessons, completedUnits);
        }

        return newCompletedLessons;
      });
    },
    [chapters, completedUnits, saveProgress]
  );

  // 레슨 완료 취소 (필요한 경우)
  const markLessonIncomplete = useCallback(
    (chapterIndex, sectionIndex) => {
      const lessonKey = `${chapterIndex}-${sectionIndex}`;

      setCompletedLessons((prev) => {
        const newCompletedLessons = { ...prev };
        delete newCompletedLessons[lessonKey];

        // 유닛 완료 상태도 업데이트
        setCompletedUnits((prevUnits) => {
          const newCompletedUnits = prevUnits.filter(
            (unitIndex) => unitIndex !== chapterIndex
          );
          saveProgress(newCompletedLessons, newCompletedUnits);
          return newCompletedUnits;
        });

        return newCompletedLessons;
      });
    },
    [saveProgress]
  );

  // 전체 진행상황 초기화
  const resetProgress = useCallback(() => {
    setCompletedLessons({});
    setCompletedUnits([]);
    if (fileName) {
      localStorage.removeItem(`progress_${fileName}`);
    }
  }, [fileName]);

  // 계산된 값들
  const totalChapters = chapters.length;
  const totalLessons = chapters.reduce(
    (sum, chapter) => sum + (chapter.sections?.length || 0),
    0
  );
  const completedLessonCount = Object.keys(completedLessons).filter(
    (key) => completedLessons[key]
  ).length;
  const progressPercentage =
    totalLessons > 0
      ? Math.round((completedLessonCount / totalLessons) * 100)
      : 0;

  // 다음 미완료 레슨 찾기
  const getNextIncompleteLesson = useCallback(() => {
    for (let chapterIdx = 0; chapterIdx < chapters.length; chapterIdx++) {
      const chapter = chapters[chapterIdx];
      if (!chapter.sections) continue;

      for (
        let sectionIdx = 0;
        sectionIdx < chapter.sections.length;
        sectionIdx++
      ) {
        const lessonKey = `${chapterIdx}-${sectionIdx}`;
        if (!completedLessons[lessonKey]) {
          return {
            chapterIndex: chapterIdx,
            sectionIndex: sectionIdx,
            chapter,
            section: chapter.sections[sectionIdx],
          };
        }
      }
    }
    return null; // 모든 레슨 완료
  }, [chapters, completedLessons]);

  // 특정 레슨의 완료 상태 확인
  const isLessonCompleted = useCallback(
    (chapterIndex, sectionIndex) => {
      const lessonKey = `${chapterIndex}-${sectionIndex}`;
      return !!completedLessons[lessonKey];
    },
    [completedLessons]
  );

  // 특정 유닛의 완료 상태 확인
  const isUnitCompleted = useCallback(
    (chapterIndex) => {
      return completedUnits.includes(chapterIndex);
    },
    [completedUnits]
  );

  // 특정 유닛의 완료된 레슨 수 계산
  const getUnitProgress = useCallback(
    (chapterIndex) => {
      if (!chapters[chapterIndex]?.sections) return { completed: 0, total: 0 };

      const chapter = chapters[chapterIndex];
      const completed = chapter.sections.filter((_, sectionIndex) =>
        isLessonCompleted(chapterIndex, sectionIndex)
      ).length;

      return {
        completed,
        total: chapter.sections.length,
      };
    },
    [chapters, isLessonCompleted]
  );

  return {
    // 상태
    completedLessons,
    completedUnits,

    // 통계
    totalChapters,
    totalLessons,
    completedLessonCount,
    progressPercentage,

    // 함수
    markLessonComplete,
    markLessonIncomplete,
    resetProgress,
    getNextIncompleteLesson,
    isLessonCompleted,
    isUnitCompleted,
    getUnitProgress,
  };
};

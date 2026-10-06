const STORAGE_KEY = "odoo-functional-lab-progress-v1";

export type ProgressState = {
  completedSteps: string[];
  completedLessons: string[];
};

function lessonKey(moduleSlug: string, lessonSlug: string) {
  return `${moduleSlug}::${lessonSlug}`;
}

function stepKey(moduleSlug: string, lessonSlug: string, stepId: string) {
  return `${moduleSlug}::${lessonSlug}::${stepId}`;
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") {
    return { completedSteps: [], completedLessons: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedSteps: [], completedLessons: [] };
    return JSON.parse(raw) as ProgressState;
  } catch {
    return { completedSteps: [], completedLessons: [] };
  }
}

export function saveProgress(state: ProgressState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function isStepDone(
  state: ProgressState,
  moduleSlug: string,
  lessonSlug: string,
  stepId: string,
) {
  return state.completedSteps.includes(stepKey(moduleSlug, lessonSlug, stepId));
}

export function isLessonDone(
  state: ProgressState,
  moduleSlug: string,
  lessonSlug: string,
) {
  return state.completedLessons.includes(lessonKey(moduleSlug, lessonSlug));
}

export function toggleStep(
  state: ProgressState,
  moduleSlug: string,
  lessonSlug: string,
  stepId: string,
  stepCount: number,
): ProgressState {
  const key = stepKey(moduleSlug, lessonSlug, stepId);
  const completedSteps = state.completedSteps.includes(key)
    ? state.completedSteps.filter((k) => k !== key)
    : [...state.completedSteps, key];

  const doneInLesson = completedSteps.filter((k) =>
    k.startsWith(`${moduleSlug}::${lessonSlug}::`),
  ).length;

  const lKey = lessonKey(moduleSlug, lessonSlug);
  let completedLessons = state.completedLessons.filter((k) => k !== lKey);
  if (doneInLesson >= stepCount) {
    completedLessons = [...completedLessons, lKey];
  }

  return { completedSteps, completedLessons };
}

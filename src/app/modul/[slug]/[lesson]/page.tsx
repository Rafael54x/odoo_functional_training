import { notFound } from "next/navigation";
import { LessonClient } from "@/components/lesson-client";
import {
  getAdjacentLesson,
  getAllLessons,
  getLesson,
} from "@/data/modules";

export function generateStaticParams() {
  return getAllLessons().map(({ module, lesson }) => ({
    slug: module.slug,
    lesson: lesson.slug,
  }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lesson: string }>;
}) {
  const { slug, lesson: lessonSlug } = await params;
  const found = getLesson(slug, lessonSlug);
  if (!found) notFound();

  const { prev, next } = getAdjacentLesson(slug, lessonSlug);

  return (
    <LessonClient
      module={found.module}
      lesson={found.lesson}
      prev={
        prev
          ? {
              moduleSlug: prev.module.slug,
              lessonSlug: prev.lesson.slug,
              title: prev.lesson.title,
            }
          : undefined
      }
      next={
        next
          ? {
              moduleSlug: next.module.slug,
              lessonSlug: next.lesson.slug,
              title: next.lesson.title,
            }
          : undefined
      }
    />
  );
}

import { notFound } from "next/navigation";
import { DeepDiveView } from "@/components/deep-dive-view";
import { deepDiveModules, getDeepDive } from "@/data/deep-dive/modules";

export function generateStaticParams() {
  return deepDiveModules.map((m) => ({ slug: m.slug }));
}

export default async function MateriModulPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = getDeepDive(slug);
  if (!mod) notFound();
  return <DeepDiveView mod={mod} />;
}

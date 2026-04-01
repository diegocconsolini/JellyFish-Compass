"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, notFound } from "next/navigation";
import { PageHero } from "@/components/ui/page-hero";
import { SectionDivider } from "@/components/ui/section-divider";
import { GuidePanel } from "@/components/ui/guide-panel";
import { PlaybookProgress } from "@/components/ui/playbook-progress";
import { PlaybookStepSection } from "@/components/ui/playbook-step";
import { playbooks } from "@/data/playbooks";

const categoryLabels: Record<string, string> = {
  "sprint-delivery": "Sprint & Delivery",
  "capacity-planning": "Capacity & Planning",
  "devex-health": "DevEx & Health",
  "metrics": "Metrics",
  "executive": "Executive",
  "ai-innovation": "AI & Innovation",
};

export default function PlaybookDetailPage() {
  const params = useParams<{ slug: string }>();
  const playbook = playbooks.find((p) => p.slug === params.slug);

  const [token, setToken] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const stepsRef = useRef<(HTMLElement | null)[]>([]);

  const setStepRef = useCallback((index: number) => (el: HTMLElement | null) => {
    stepsRef.current[index] = el;
  }, []);

  useEffect(() => {
    if (!playbook) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = stepsRef.current.indexOf(entry.target as HTMLElement);
            if (index !== -1) setCurrentStep(index);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    stepsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [playbook]);

  if (!playbook) return notFound();

  function handleStepClick(index: number) {
    const el = stepsRef.current[index];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const progressSteps = playbook.steps.map((s, i) => ({
    id: `step-${i}`,
    title: s.title,
  }));

  const guideTabs = playbook.guides.map((g) => ({
    key: g.key,
    label: g.label,
    content: <p>{g.description}</p>,
  }));

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-7 py-7">
      <PageHero
        eyebrow={categoryLabels[playbook.category] ?? playbook.category}
        title={playbook.title}
        subtitle={playbook.goal}
      />

      <p className="text-xs text-text-ghost mb-2">
        Source:{" "}
        <a
          href={playbook.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue"
        >
          {playbook.source.label}
        </a>
      </p>

      <SectionDivider />

      {guideTabs.length > 0 && (
        <>
          <GuidePanel tabs={guideTabs} />
          <SectionDivider />
        </>
      )}

      <PlaybookProgress
        steps={progressSteps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      <div className="mt-6">
        {playbook.steps.map((step, i) => (
          <div key={i} ref={setStepRef(i)}>
            <PlaybookStepSection
              index={i}
              step={step}
              token={token}
              setToken={setToken}
            />
          </div>
        ))}
      </div>

      <SectionDivider />

      <p className="text-xs text-text-ghost text-center py-4">
        All content sourced from{" "}
        <a
          href={playbook.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue"
        >
          {playbook.source.label}
        </a>
        . Mock data is fictional demonstration data.
      </p>
    </div>
  );
}

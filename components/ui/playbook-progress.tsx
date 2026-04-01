"use client";

export function PlaybookProgress({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: { id: string; title: string }[];
  currentStep: number;
  onStepClick: (index: number) => void;
}) {
  return (
    <nav
      aria-label="Playbook progress"
      className="sticky top-0 z-10 bg-bg/95 backdrop-blur-sm border-b border-border py-3 -mx-4 px-4 sm:-mx-7 sm:px-7 overflow-x-auto"
    >
      <ol className="flex gap-2 min-w-max">
        {steps.map((step, i) => (
          <li key={step.id}>
            <button
              onClick={() => onStepClick(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                i === currentStep
                  ? "bg-blue-dim text-blue"
                  : i < currentStep
                    ? "bg-surface-raised text-text-dim"
                    : "bg-surface-raised text-text-ghost"
              }`}
              aria-current={i === currentStep ? "step" : undefined}
            >
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                  i === currentStep
                    ? "bg-blue text-white"
                    : "bg-border text-text-ghost"
                }`}
              >
                {i + 1}
              </span>
              <span className="hidden sm:inline">{step.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

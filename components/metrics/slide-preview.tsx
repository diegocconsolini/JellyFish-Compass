"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type SlideBlockId, slideBlocks } from "@/data/slide-templates";

type Props = {
  activeSlides: SlideBlockId[];
  selectedIndex: number;
  onPrev: () => void;
  onNext: () => void;
  children: React.ReactNode;
};

export function SlidePreview({
  activeSlides,
  selectedIndex,
  onPrev,
  onNext,
  children,
}: Props) {
  const block = slideBlocks.find((b) => b.id === activeSlides[selectedIndex]);
  const label = block?.label || "Slide";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-text-ghost">
          Slide {selectedIndex + 1} of {activeSlides.length} —{" "}
          <span className="text-text-dim font-medium">{label}</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrev}
            disabled={selectedIndex === 0}
            className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-text-ghost hover:text-text-dim disabled:opacity-30 cursor-pointer disabled:cursor-default"
            aria-label="Previous slide"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={selectedIndex >= activeSlides.length - 1}
            className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-text-ghost hover:text-text-dim disabled:opacity-30 cursor-pointer disabled:cursor-default"
            aria-label="Next slide"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-bg-deep rounded-xl border border-border p-4 flex items-center justify-center">
        <div className="w-full aspect-video bg-[#0D062B] rounded-lg overflow-hidden p-6 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

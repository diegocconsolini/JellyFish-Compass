"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { slideBlocks, type SlideBlockId } from "@/data/slide-templates";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  activeSlides: SlideBlockId[];
  selectedIndex: number;
  onReorder: (slides: SlideBlockId[]) => void;
  onToggle: (blockId: SlideBlockId) => void;
  onSelect: (index: number) => void;
};

function SortableItem({
  id,
  label,
  description,
  isSelected,
  index,
  onSelect,
}: {
  id: string;
  label: string;
  description: string;
  isSelected: boolean;
  index: number;
  onSelect: (i: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(index)}
      className={cn(
        "flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all",
        isSelected
          ? "bg-blue-dim/30 border-blue/30"
          : "bg-surface-raised border-border hover:border-border-vivid"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-text-ghost hover:text-text-dim"
        aria-label="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold truncate">{label}</div>
        <div className="text-[10px] text-text-ghost truncate">{description}</div>
      </div>
    </div>
  );
}

export function SlideList({
  activeSlides,
  selectedIndex,
  onReorder,
  onToggle,
  onSelect,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: {
    active: { id: string | number };
    over: { id: string | number } | null;
  }) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = activeSlides.indexOf(active.id as SlideBlockId);
      const newIndex = activeSlides.indexOf(over.id as SlideBlockId);
      onReorder(arrayMove(activeSlides, oldIndex, newIndex));
    }
  }

  const inactiveBlocks = slideBlocks.filter(
    (b) => !activeSlides.includes(b.id)
  );

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest text-text-ghost">
        Slides ({activeSlides.length})
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={activeSlides}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {activeSlides.map((blockId, index) => {
              const block = slideBlocks.find((b) => b.id === blockId);
              if (!block) return null;
              return (
                <SortableItem
                  key={block.id}
                  id={block.id}
                  label={block.label}
                  description={block.description}
                  isSelected={index === selectedIndex}
                  index={index}
                  onSelect={onSelect}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {inactiveBlocks.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-ghost mb-1.5">
            Add slides
          </p>
          <div className="space-y-1">
            {inactiveBlocks.map((block) => (
              <button
                key={block.id}
                type="button"
                onClick={() => onToggle(block.id)}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-text-ghost hover:text-text-dim hover:border-border-vivid transition-all text-xs"
              >
                <span className="text-blue">+</span>
                {block.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

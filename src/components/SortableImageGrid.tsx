"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Image = { id: string; url: string };

type Props = {
  images: Image[];
  coverUrl?: string;
  onReorder: (images: Image[]) => void;
  onRemove: (image: Image) => void;
  onSetCover?: (url: string) => void;
};

/* ── Cada imagen draggable ───────────────────────────────── */

function SortableImage({
  image,
  isCover,
  onRemove,
  onSetCover,
}: {
  image: Image;
  isCover: boolean;
  onRemove: () => void;
  onSetCover?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg overflow-hidden border border-gray-200 select-none"
    >
      {/* Drag handle — toda la imagen */}
      <div {...attributes} {...listeners} className="touch-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.url} alt="" className="w-full h-32 object-cover" />
      </div>

      {/* Overlay con acciones */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onRemove}
          className="text-xs bg-red-600 text-white px-2 py-1 rounded"
        >
          Eliminar
        </button>
        {onSetCover && !isCover && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onSetCover}
            className="text-xs bg-white text-black px-2 py-1 rounded"
          >
            Portada
          </button>
        )}
      </div>

      {/* Badge portada */}
      {isCover && (
        <div className="absolute top-1 left-1 text-xs bg-black text-white px-1.5 py-0.5 rounded pointer-events-none">
          Portada
        </div>
      )}

      {/* Icono drag */}
      <div className="absolute bottom-1 right-1 text-white/60 text-xs pointer-events-none select-none">
        ⠿
      </div>
    </div>
  );
}

/* ── Grid principal ──────────────────────────────────────── */

export default function SortableImageGrid({
  images,
  coverUrl,
  onReorder,
  onRemove,
  onSetCover,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    onReorder(arrayMove(images, oldIndex, newIndex));
  }

  if (images.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img) => (
            <SortableImage
              key={img.id}
              image={img}
              isCover={coverUrl === img.url}
              onRemove={() => onRemove(img)}
              onSetCover={onSetCover ? () => onSetCover(img.url) : undefined}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

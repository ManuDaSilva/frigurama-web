"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";

declare global {
  interface Window { cloudinary?: any; }
}

type Props = {
  content: string; // HTML inicial
  onChange: (html: string) => void;
  compact?: boolean; // altura reducida para campos de descripción
};

export default function RichTextEditor({ content, onChange, compact = false }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({ inline: false }),
      LinkExtension.configure({ openOnClick: false }),
    ],
    immediatelyRender: false,
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "outline-none" },
    },
  });

  function insertImage() {
    if (!window.cloudinary || !editor) return;
    window.cloudinary
      .createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          folder: "proyectos",
          sources: ["local", "url", "camera"],
          multiple: false,
          maxFiles: 1,
        },
        (error: any, result: any) => {
          if (!error && result?.event === "success") {
            editor
              .chain()
              .focus()
              .setImage({ src: result.info.secure_url })
              .run();
          }
        }
      )
      .open();
  }

  function setLink() {
    const prev = editor?.getAttributes("link").href ?? "";
    const url = window.prompt("URL del enlace:", prev);
    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().unsetLink().run();
    } else {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }

  if (!editor) return null;

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-gray-50 px-2 py-1.5 sticky top-14 z-10">
        <Group>
          <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Negrita">
            <b>B</b>
          </Btn>
          <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Cursiva">
            <i>I</i>
          </Btn>
        </Group>

        <Sep />

        <Group>
          <Btn active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Título 1">H1</Btn>
          <Btn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Título 2">H2</Btn>
          <Btn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Título 3">H3</Btn>
        </Group>

        <Sep />

        <Group>
          <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista">• Lista</Btn>
          <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista numerada">1. Lista</Btn>
        </Group>

        <Sep />

        <Group>
          <Btn active={editor.isActive("link")} onClick={setLink} title="Enlace">Enlace</Btn>
          <Btn onClick={insertImage} title="Insertar imagen">Imagen</Btn>
          <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Separador">—</Btn>
        </Group>

        <Sep />

        <Group>
          <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Deshacer">↩</Btn>
          <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Rehacer">↪</Btn>
        </Group>
      </div>

      {/* ── Editor area ──────────────────────────────────── */}
      <div
        className={`
          px-8 py-6 ${compact ? "min-h-[200px]" : "min-h-[480px]"} cursor-text
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:leading-tight [&_.ProseMirror_h1]:mt-6 [&_.ProseMirror_h1]:mb-3
          [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:leading-tight [&_.ProseMirror_h2]:mt-5 [&_.ProseMirror_h2]:mb-2
          [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:mb-2
          [&_.ProseMirror_p]:text-[15px] [&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_p]:text-black/75 [&_.ProseMirror_p]:mb-3
          [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:mb-3
          [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:mb-3
          [&_.ProseMirror_li]:mb-1 [&_.ProseMirror_li]:text-[15px] [&_.ProseMirror_li]:leading-relaxed [&_.ProseMirror_li]:text-black/75
          [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:underline-offset-2 [&_.ProseMirror_a]:text-black/80
          [&_.ProseMirror_img]:rounded-xl [&_.ProseMirror_img]:my-6 [&_.ProseMirror_img]:max-w-full
          [&_.ProseMirror_hr]:border-black/10 [&_.ProseMirror_hr]:my-8
          [&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_.is-editor-empty:first-child::before]:text-gray-300 [&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_.is-editor-empty:first-child::before]:h-0
        `}
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function Sep() {
  return <div className="w-px h-5 bg-gray-200 mx-1" />;
}

function Btn({
  children,
  active,
  disabled,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        "px-2.5 py-1 rounded text-sm transition select-none",
        active ? "bg-black text-white" : "text-gray-600 hover:bg-gray-200 hover:text-black",
        disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

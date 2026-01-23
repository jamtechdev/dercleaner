"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useState } from "react";
import "./rich-text-editor.css";

interface RichTextEditorProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}

export function RichTextEditor({ name, defaultValue = "", placeholder = "" }: RichTextEditorProps) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Strike,
      Code,
      Blockquote,
      HorizontalRule,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-brand underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: placeholder || "Text eingeben...",
      }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = html;
      }
    },
  });

  // Update editor content when defaultValue changes
  useEffect(() => {
    if (editor && defaultValue !== undefined) {
      const currentContent = editor.getHTML();
      if (currentContent !== defaultValue) {
        editor.commands.setContent(defaultValue, false);
      }
    }
  }, [defaultValue, editor]);

  // Initialize hidden input
  useEffect(() => {
    if (hiddenInputRef.current && editor) {
      hiddenInputRef.current.value = editor.getHTML();
    }
  }, [editor]);

  if (!isMounted || !editor) {
    return (
      <div className="rich-text-editor-wrapper">
        <div className="min-h-[300px] rounded-xl border border-brand/20 bg-white px-4 py-3 flex items-center justify-center">
          <p className="text-sm text-gray-500">Editor wird geladen...</p>
        </div>
        <input
          ref={hiddenInputRef}
          type="hidden"
          name={name}
          defaultValue={defaultValue}
        />
      </div>
    );
  }

  return (
    <div className="rich-text-editor-wrapper">
      {/* Toolbar */}
      <div className="rich-text-toolbar rounded-t-xl border border-brand/20 border-b-0 bg-gray-50 p-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            editor.isActive("heading", { level: 1 })
              ? "bg-brand text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-brand text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-brand text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          H3
        </button>
        <div className="w-px h-6 bg-gray-300" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            editor.isActive("bold")
              ? "bg-brand text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            editor.isActive("italic")
              ? "bg-brand text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            editor.isActive("underline")
              ? "bg-brand text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            editor.isActive("strike")
              ? "bg-brand text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          <s>S</s>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            editor.isActive("code")
              ? "bg-brand text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          &lt;/&gt;
        </button>
        <div className="w-px h-6 bg-gray-300" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            editor.isActive("bulletList")
              ? "bg-brand text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            editor.isActive("orderedList")
              ? "bg-brand text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          1.
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
          disabled={!editor.can().sinkListItem("listItem")}
          className="px-3 py-1.5 text-xs font-semibold rounded bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Liste einrücken"
        >
          ↳
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().liftListItem("listItem").run()}
          disabled={!editor.can().liftListItem("listItem")}
          className="px-3 py-1.5 text-xs font-semibold rounded bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Liste ausrücken"
        >
          ↲
        </button>
        <div className="w-px h-6 bg-gray-300" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            editor.isActive("blockquote")
              ? "bg-brand text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          title="Zitat"
        >
          "
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1.5 text-xs font-semibold rounded bg-white text-gray-700 hover:bg-gray-100 transition-colors"
          title="Horizontale Linie"
        >
          ─
        </button>
        <div className="w-px h-6 bg-gray-300" />
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("URL eingeben:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            editor.isActive("link")
              ? "bg-brand text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            editor.isActive({ textAlign: "left" })
              ? "bg-brand text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            editor.isActive({ textAlign: "center" })
              ? "bg-brand text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          ↔
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
            editor.isActive({ textAlign: "right" })
              ? "bg-brand text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          →
        </button>
        <div className="w-px h-6 bg-gray-300" />
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="px-3 py-1.5 text-xs font-semibold rounded bg-white text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Bereinigen
        </button>
      </div>

      {/* Editor Content */}
      <div className="rich-text-editor-content rounded-b-xl border border-brand/20 bg-white">
        <EditorContent editor={editor} />
      </div>

      <input
        ref={hiddenInputRef}
        type="hidden"
        name={name}
        defaultValue={defaultValue}
      />
    </div>
  );
}

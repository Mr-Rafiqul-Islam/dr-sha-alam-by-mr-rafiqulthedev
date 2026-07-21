/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor } from "@tinymce/tinymce-react";
import { TINYMCE_API_KEY } from "../../config/env";

/** Loaded inside the editor iframe so font picks render correctly in content. */
const RTE_GOOGLE_FONTS_IMPORT = String.raw`@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Anek+Bangla:wght@400;500;600;700&display=swap");`;

type RichTextEditorProps = {
  onInit?: (...args: any[]) => void;
  initialValue?: string;
  /** Controlled HTML (e.g. react-hook-form). When set, `initialValue` is ignored. */
  value?: string;
  onChange?: (html: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function RichTextEditor({
  onInit,
  initialValue,
  value,
  onChange,
  disabled = false,
  placeholder = "Enter the deep dive clinical details here...",
}: RichTextEditorProps) {
  const controlled = value !== undefined;

  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
      <Editor
        onInit={onInit}
        apiKey={TINYMCE_API_KEY}
        // apiKey="dvpt6yrghqn11su5e7uutgqqjqrvjq3l1khrnit4hkgv762u"
        // apiKey="b40orfn9hpx3sw7p1wp654ssunzz4mf5s7ic8ljsycua7nu4"
        disabled={disabled}
        {...(controlled
          ? {
              value: value ?? "",
              onEditorChange: (content: string) => onChange?.(content),
            }
          : {
              initialValue: initialValue || "",
            })}
        init={{
          menubar: false,
          height: 320,
          placeholder,
          plugins: [
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "image",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
          ],
          /** Paste is core in TinyMCE 6; listing `paste` in plugins 404s on Tiny Cloud. */
          paste_as_text: false,
          paste_remove_styles: true,
          paste_remove_spans: true,
          paste_strip_class_attributes: "all",

          forced_root_block: "p",

          // remove junk class on paste
          paste_preprocess: (_plugin: any, args: any) => {
            args.content = args.content.replace(/class="[^"]*"/g, "");
          },

          content_style: `${RTE_GOOGLE_FONTS_IMPORT}
            body { font-family: Inter, sans-serif; font-size: 16px; color: #181c1f; }`,

          font_family_formats:
            "Inter=Inter, sans-serif; Montserrat=Montserrat, sans-serif; Anek Bangla='Anek Bangla', sans-serif; Arial=arial,helvetica,sans-serif; Georgia=georgia,palatino,serif; Times New Roman=times new roman,times,serif; Courier New=courier new,courier,monospace",

          font_size_formats:
            "8px 10px 12px 14px 16px 18px 20px 22px 24px 26px 30px 32px 36px 38px",

          branding: false,
          promotion: false,
          statusbar: false,

          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
        }}
      />
    </div>
  );
}

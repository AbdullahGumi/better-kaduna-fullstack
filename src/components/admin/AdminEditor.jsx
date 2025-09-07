"use client";

import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import { useAuth } from "@/lib/useAuth";
import apiService from "@/services/apiService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Undo,
  Redo,
  Eye,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Maximize,
  Minimize,
  Video,
  Youtube,
  FileVideo,
  Link,
  Code,
  Quote,
  Type,
  Palette,
  Heading1,
  Heading2,
  Heading3,
  FileImage,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
} from "lucide-react";
import { uploadToCloudinary } from "@/utils/cloudinary";

// Font sizes array
const fontSizes = [
  { label: "10px", value: "10px" },
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "28px", value: "28px" },
  { label: "32px", value: "32px" },
  { label: "36px", value: "36px" },
  { label: "48px", value: "48px" },
  { label: "60px", value: "60px" },
  { label: "72px", value: "72px" },
  { label: "96px", value: "96px" },
  { label: "120px", value: "120px" },
];

// Custom Color extension
const Color = Extension.create({
  name: "color",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          color: {
            default: null,
            parseHTML: (el) => el.style.color || null,
            renderHTML: (attrs) =>
              attrs.color ? { style: `color: ${attrs.color}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setColor:
        (color) =>
        ({ chain }) =>
          chain().setMark("textStyle", { color }).run(),
      unsetColor:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { color: null }).run(),
    };
  },
});

// Custom FontSize extension
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize || null,
            renderHTML: (attrs) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).run(),
    };
  },
});

// Custom ImageAlignment extension to ensure images respect parent text-align
const ImageAlignment = Extension.create({
  name: "imageAlignment",
  addOptions() {
    return {
      types: ["image"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: ["image"],
        attributes: {
          style: {
            default: null,
            parseHTML: (el) => el.getAttribute("style") || null,
            renderHTML: (attrs) => (attrs.style ? { style: attrs.style } : {}),
          },
        },
      },
    ];
  },
});

const headings = [
  { label: "Paragraph", level: 0 },
  { label: "H1", level: 1 },
  { label: "H2", level: 2 },
  { label: "H3", level: 3 },
];

const AdminEditor = ({
  id,
  type,
  fields,
  placeholder,
  titleLabel,
  draftKeyPrefix,
}) => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [isPreview, setIsPreview] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [, forceUpdate] = useState({});
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const cleanImageHTML = useCallback((html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const images = doc.querySelectorAll("img[containerstyle][wrapperstyle]");

    images.forEach((img) => {
      const containerStyle = img.getAttribute("containerstyle");
      img.removeAttribute("containerstyle");
      img.removeAttribute("wrapperstyle");

      const styleMatch = containerStyle.match(
        /width:\s*(\d+)px;\s*height:\s*(\d+|auto)/
      );
      if (styleMatch) {
        const width = styleMatch[1];
        const height = styleMatch[2];

        if (width) {
          img.setAttribute("width", width);
          if (height === "auto" && img.naturalWidth && img.naturalHeight) {
            const aspectRatio = img.naturalHeight / img.naturalWidth;
            const calculatedHeight = Math.round(
              parseInt(width, 10) * aspectRatio
            );
            img.setAttribute("height", calculatedHeight);
          } else if (height !== "auto") {
            img.setAttribute("height", height);
          }
        }
      }

      const parent = img.parentElement;
      if (parent && parent.getAttribute("style")?.includes("display: flex")) {
        parent.replaceWith(img);
      }
    });

    return doc.body.innerHTML;
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: { depth: 50 },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
        blockquote: false,
      }),
      Image,
      ImageResize.configure({
        inline: false,
        allowBase64: false,
        keepAspectRatio: true,
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
      Typography,
      TextStyle,
      Color,
      FontSize,
      ImageAlignment,
    ],
    content: "",
    immediatelyRender: false,
    autofocus: true,
    onUpdate: useCallback(
      ({ editor }) => {
        const content = cleanImageHTML(editor.getHTML());
        setFormData((prev) => {
          const updated = { ...prev, content };
          if (id) {
            localStorage.setItem(
              `${draftKeyPrefix}-${id}`,
              JSON.stringify(updated)
            );
          }
          return updated;
        });
      },
      [id, draftKeyPrefix, cleanImageHTML]
    ),
    editorProps: {
      attributes: {
        class:
          "prose min-h-[400px] p-4 focus:outline-none border-t-0 border border-gray-300 rounded-b-md",
      },
      handleKeyDown: useCallback((view, event) => {
        if (event.ctrlKey || event.metaKey) {
          switch (event.key) {
            case "b":
              editor.chain().focus().toggleBold().run();
              return true;
            case "i":
              editor.chain().focus().toggleItalic().run();
              return true;
            case "l":
              editor.chain().focus().setTextAlign("left").run();
              return true;
            case "r":
              editor.chain().focus().setTextAlign("right").run();
              return true;
            case "e":
              editor.chain().focus().setTextAlign("center").run();
              return true;
          }
        }
        return false;
      }, []),
    },
  });

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          let data;
          if (type === "post") {
            data = await apiService.getPost(id);
          } else if (type === "event") {
            data = await apiService.getEvent(id);
          } else if (type === "mda") {
            data = await apiService.getMDA(id);
          }
          setFormData(data);
          editor?.commands.setContent(data.content || "");
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [id, editor, type]);

  useEffect(() => {
    if (isFullScreen && !isPreview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullScreen, isPreview]);

  useEffect(() => {
    if (!editor) return;
    editor.on("transaction", () => forceUpdate({}));
    return () => {
      editor.off("transaction");
    };
  }, [editor]);

  useEffect(() => {
    if (id) {
      const draft = localStorage.getItem(`${draftKeyPrefix}-${id}`);
      if (draft) {
        const data = JSON.parse(draft);
        setFormData(data);
        const contentField =
          fields.find((f) => f.type === "editor")?.name || "content";
        editor?.commands.setContent(data[contentField] || "");
      }
    }
  }, [id, editor, draftKeyPrefix]);

  const handleImageUpload = useCallback(
    async (file) => {
      if (!file || !file.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        toast.error("Invalid file type", { autoClose: 3000 });
        return;
      }
      try {
        setIsUploadingImage(true);
        setError("");
        const imageUrl = await uploadToCloudinary(file);
        editor.chain().focus().setImage({ src: imageUrl }).run();
        toast.success("Image uploaded successfully", { autoClose: 2000 });
      } catch (err) {
        console.error(err);
        setError("Failed to upload image.");
        toast.error("Image upload failed", { autoClose: 3000 });
      } finally {
        setIsUploadingImage(false);
      }
    },
    [editor]
  );

  const handleThumbnailUpload = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file for thumbnail.");
      toast.error("Invalid thumbnail file type", { autoClose: 3000 });
      return;
    }
    try {
      setIsUploadingThumbnail(true);
      setError("");
      const imageUrl = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, thumbnail: imageUrl }));
      toast.success("Thumbnail uploaded successfully", { autoClose: 2000 });
    } catch (err) {
      console.error(err);
      setError("Failed to upload thumbnail.");
      toast.error("Thumbnail upload failed", { autoClose: 3000 });
    } finally {
      setIsUploadingThumbnail(false);
    }
  }, []);

  const triggerImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const triggerThumbnailUpload = useCallback(() => {
    thumbnailInputRef.current?.click();
  }, []);

  const triggerVideoUpload = useCallback(() => {
    videoInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        handleImageUpload(file);
      }
    },
    [handleImageUpload]
  );

  const handleThumbnailInputChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        handleThumbnailUpload(file);
      }
    },
    [handleThumbnailUpload]
  );

  const handleVideoInputChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      handleVideoUpload(file);
    }
  }, []);

  const handleVideoUpload = useCallback(
    async (file) => {
      if (!file || !file.type.startsWith("video/")) {
        setError("Please upload a valid video file.");
        toast.error("Invalid file type", { autoClose: 3000 });
        return;
      }

      // Check file size (limit to 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setError("Video file size must be less than 100MB.");
        toast.error("File too large", { autoClose: 3000 });
        return;
      }

      try {
        setIsUploadingVideo(true);
        setError("");
        const videoUrl = await uploadToCloudinary(file);
        const videoHtml = `<video controls style="max-width: 100%; height: auto;">
          <source src="${videoUrl}" type="${file.type}">
          Your browser does not support the video tag.
        </video><br>`;
        editor.chain().focus().insertContent(videoHtml).run();
        toast.success("Video uploaded successfully", { autoClose: 2000 });
      } catch (err) {
        console.error(err);
        setError("Failed to upload video.");
        toast.error("Video upload failed", { autoClose: 3000 });
      } finally {
        setIsUploadingVideo(false);
      }
    },
    [editor]
  );

  const handleYouTubeEmbed = useCallback(() => {
    const url = prompt("Enter YouTube URL:");
    if (url) {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        const embedHtml = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
          <iframe src="https://www.youtube.com/embed/${videoId}"
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                  frameborder="0" allowfullscreen></iframe>
        </div><br>`;
        editor.chain().focus().insertContent(embedHtml).run();
        toast.success("YouTube video embedded", { autoClose: 2000 });
      } else {
        toast.error("Invalid YouTube URL", { autoClose: 3000 });
      }
    }
  }, [editor]);

  const extractYouTubeId = (url) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
      /(?:https?:\/\/)?youtu\.be\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleTextColor = useCallback(
    (color) => {
      if (editor && color) {
        editor.chain().focus().setColor(color).run();
      }
    },
    [editor]
  );

  const handleFontSize = useCallback(
    (fontSize) => {
      if (editor && fontSize) {
        editor.chain().focus().setFontSize(fontSize).run();
      }
    },
    [editor]
  );

  const handleHeading = useCallback(
    (level) => {
      if (editor) {
        if (level === 0) {
          editor.chain().focus().setParagraph().run();
        } else {
          editor.chain().focus().toggleHeading({ level }).run();
        }
      }
    },
    [editor]
  );

  const isHeadingActive = useCallback(
    (level) => {
      if (level === 0) {
        return editor?.isActive("paragraph");
      }
      return editor?.isActive("heading", { level });
    },
    [editor]
  );

  const isFontSizeActive = useCallback(
    (fontSize) => {
      return editor?.isActive("textStyle", { fontSize });
    },
    [editor]
  );

  const handleFullScreenToggle = useCallback(() => {
    setIsFullScreen((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(async () => {
    const requiredFields = fields.filter((f) => f.required).map((f) => f.name);
    if (requiredFields.some((field) => !formData[field])) {
      setError("Please fill in all required fields.");
      toast.error("Missing required fields", { autoClose: 3000 });
      return;
    }
    if (!user || user.role !== "admin") return;
    setIsSaving(true);
    const data = {
      id: id || Date.now(),
      ...formData,
      ...(type === "post" && { date: new Date().toISOString() }),
      ...(type === "mda" && { date: new Date().toISOString() }),
    };
    try {
      if (id) {
        if (type === "post") {
          await apiService.updatePost(id, data);
        } else if (type === "event") {
          await apiService.updateEvent(id, data);
        } else if (type === "mda") {
          await apiService.updateMDA(id, data);
        }
      } else {
        if (type === "post") {
          await apiService.createPost(data);
        } else if (type === "event") {
          await apiService.createEvent(data);
        } else if (type === "mda") {
          await apiService.createMDA(data);
        }
      }
      localStorage.removeItem(`${draftKeyPrefix}-${id}`);
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} saved successfully!`,
        { autoClose: 2000 }
      );
      router.push("/admin/dashboard");
    } catch (error) {
      console.log(error);
      setIsSaving(false);
    }
  }, [id, formData, fields, user, type, draftKeyPrefix, router]);

  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const toolbarGroups = useMemo(
    () => [
      [
        {
          label: "Bold (Ctrl+B)",
          icon: <Bold className="w-5 h-5" />,
          action: () => editor?.chain().focus().toggleBold().run(),
          active: editor?.isActive("bold"),
        },
        {
          label: "Italic (Ctrl+I)",
          icon: <Italic className="w-5 h-5" />,
          action: () => editor?.chain().focus().toggleItalic().run(),
          active: editor?.isActive("italic"),
        },
      ],

      [
        {
          label: "Text Color",
          component: (
            <input
              type="color"
              onChange={(e) => handleTextColor(e.target.value)}
              className="p-1 w-10 h-10 rounded bg-white hover:bg-gray-100 focus:ring-2 focus:ring-kaduna-green"
              aria-label="Text Color"
            />
          ),
        },
        {
          label: "Font Size",
          component: (
            <select
              onChange={(e) => handleFontSize(e.target.value)}
              className="p-2 rounded bg-white hover:bg-gray-100 focus:ring-2 focus:ring-kaduna-green"
              aria-label="Font Size"
              defaultValue=""
            >
              <option value="" disabled>
                Font Size
              </option>
              {fontSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          ),
          active: fontSizes.some((size) => isFontSizeActive(size.value)),
        },
      ],
      [
        {
          label: "Heading",
          component: (
            <select
              onChange={(e) => handleHeading(Number(e.target.value))}
              className="p-2 rounded bg-white hover:bg-gray-100 focus:ring-2 focus:ring-kaduna-green"
              aria-label="Heading Level"
              defaultValue=""
            >
              <option value="" disabled>
                Heading
              </option>
              {headings.map((heading) => (
                <option key={heading.level} value={heading.level}>
                  {heading.label}
                </option>
              ))}
            </select>
          ),
          active: headings.some((heading) => isHeadingActive(heading.level)),
        },
      ],
      [
        {
          label: "Align Left (Ctrl+L)",
          icon: <AlignLeft className="w-5 h-5" />,
          action: () => editor?.chain().focus().setTextAlign("left").run(),
          active: editor?.isActive({ textAlign: "left" }),
        },
        {
          label: "Align Center (Ctrl+E)",
          icon: <AlignCenter className="w-5 h-5" />,
          action: () => editor?.chain().focus().setTextAlign("center").run(),
          active: editor?.isActive({ textAlign: "center" }),
        },
        {
          label: "Align Right (Ctrl+R)",
          icon: <AlignRight className="w-5 h-5" />,
          action: () => editor?.chain().focus().setTextAlign("right").run(),
          active: editor?.isActive({ textAlign: "right" }),
        },
      ],
      [
        {
          label: "Bullet List",
          icon: <List className="w-5 h-5" />,
          action: () => editor?.chain().focus().toggleBulletList().run(),
          active: editor?.isActive("bulletList"),
        },
        {
          label: "Numbered List",
          icon: <ListOrdered className="w-5 h-5" />,
          action: () => editor?.chain().focus().toggleOrderedList().run(),
          active: editor?.isActive("orderedList"),
        },
      ],
      [
        {
          label: "Insert Image",
          icon: isUploadingImage ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ImageIcon className="w-5 h-5" />
          ),
          action: triggerImageUpload,
          active: false,
          disabled: isUploadingImage,
        },
        {
          label: "Upload Video",
          icon: isUploadingVideo ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Video className="w-5 h-5" />
          ),
          action: triggerVideoUpload,
          active: false,
          disabled: isUploadingVideo,
        },
        {
          label: "Embed YouTube",
          icon: <Youtube className="w-5 h-5" />,
          action: handleYouTubeEmbed,
          active: false,
        },
      ],
      [
        {
          label: isFullScreen ? "Exit Full Screen" : "Full Screen",
          icon: isFullScreen ? (
            <Minimize className="w-5 h-5" />
          ) : (
            <Maximize className="w-5 h-5" />
          ),
          action: handleFullScreenToggle,
          active: isFullScreen,
        },
      ],
      [
        {
          label: "Undo",
          icon: <Undo className="w-5 h-5" />,
          action: () => editor?.chain().focus().undo().run(),
        },
        {
          label: "Redo",
          icon: <Redo className="w-5 h-5" />,
          action: () => editor?.chain().focus().redo().run(),
        },
      ],
    ],
    [
      editor,
      triggerImageUpload,
      handleTextColor,
      handleFontSize,
      handleHeading,
      isHeadingActive,
      isFontSizeActive,
      isFullScreen,
      handleFullScreenToggle,
    ]
  );

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-kaduna-gray">Access Denied. Admins only.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-sans">
      <style jsx>
        {`
          .ProseMirror .image-resizer {
            display: inline-flex;
            position: relative;
            flex-grow: 0;
          }
          .ProseMirror .image-resizer .resize-trigger {
            position: absolute;
            right: -6px;
            bottom: -6px;
            opacity: 0;
            transition: opacity 0.3s ease;
            color: #3259a5;
            cursor: se-resize;
          }
          .ProseMirror .image-resizer:hover .resize-trigger {
            opacity: 1;
          }
          .preview-content {
            overflow: hidden;
          }
          .preview-content img {
            max-width: 100% !important;
            height: auto !important;
            display: block;
          }
          .editor-fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            background: white;
            display: flex;
            flex-direction: column;
          }
          .editor-fullscreen .toolbar {
            position: sticky;
            top: 0;
            z-index: 1001;
            background: linear-gradient(to right, #f9fafb, #e5e7eb);
            padding: 0.5rem;
            border-bottom: 1px solid #d1d5db;
          }
          .editor-fullscreen .ProseMirror {
            flex-grow: 1;
            overflow-y: auto;
            padding: 1rem;
          }
        `}
      </style>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h1 className="text-3xl font-bold text-kaduna-gray mb-6">
        {id ? `Edit ${titleLabel}` : `Create ${titleLabel}`}
      </h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="btn-green px-4 py-2 rounded-md flex items-center transition transform hover:scale-105 hover:shadow-sm"
              aria-label={
                isPreview ? "Switch to edit mode" : "Switch to preview mode"
              }
            >
              <Eye className="w-5 h-5 mr-2" />
              {isPreview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={handleSubmit}
              className={`btn-green px-4 py-2 rounded-md flex items-center transition transform hover:scale-105 hover:shadow-sm ${
                isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSaving}
              aria-label={`Save ${type}`}
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? "Saving..." : `Save ${titleLabel}`}
            </button>
          </div>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="text-kaduna-gray hover:text-kaduna-green flex items-center transition transform hover:scale-105 hover:shadow-sm"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className={isPreview ? "md:w-1/2" : "w-full"}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
            />
            <input
              type="file"
              accept="image/*"
              ref={thumbnailInputRef}
              onChange={handleThumbnailInputChange}
              className="hidden"
            />
            <input
              type="file"
              accept="video/*"
              ref={videoInputRef}
              onChange={handleVideoInputChange}
              className="hidden"
            />
            {fields.map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block text-sm font-medium text-kaduna-gray">
                  {field.label}
                </label>
                {field.type === "file" ? (
                  <div>
                    <button
                      type="button"
                      onClick={triggerThumbnailUpload}
                      disabled={isUploadingThumbnail}
                      className={`px-4 py-2 rounded-md flex items-center ${
                        isUploadingThumbnail
                          ? "bg-gray-400 cursor-not-allowed"
                          : "btn-green hover:bg-kaduna-green-dark"
                      } transition-colors`}
                    >
                      {isUploadingThumbnail ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FileImage className="w-4 h-4 mr-2" />
                          Upload {field.label}
                        </>
                      )}
                    </button>
                    {formData[field.name] && (
                      <div className="mt-2">
                        <img
                          src={formData[field.name]}
                          alt="Thumbnail Preview"
                          className="h-24 w-24 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                ) : field.type === "editor" ? (
                  !isPreview && (
                    <div className="mb-4 pt-12">
                      <label className="block text-sm font-medium text-kaduna-gray mb-1">
                        Content
                      </label>
                      <div
                        className={`border border-gray-300 rounded-md bg-white shadow-sm ${
                          isFullScreen ? "editor-fullscreen" : ""
                        }`}
                      >
                        <div className="toolbar flex flex-wrap gap-2 p-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 sticky top-0 w-full z-50">
                          {toolbarGroups.map((group, index) => (
                            <div key={index} className="flex gap-1">
                              {group.map((item) =>
                                item.component ? (
                                  <div
                                    key={item.label}
                                    className="flex items-center"
                                  >
                                    {item.component}
                                  </div>
                                ) : (
                                  <button
                                    key={item.label}
                                    onClick={item.action}
                                    disabled={item.disabled}
                                    className={`p-2 rounded ${
                                      item.active
                                        ? "bg-kaduna-green text-white"
                                        : item.disabled
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-white hover:bg-gray-100 hover:shadow-sm"
                                    } transition duration-200`}
                                    title={item.label}
                                    aria-label={item.label}
                                  >
                                    {item.icon}
                                  </button>
                                )
                              )}
                              {index < toolbarGroups.length - 1 && (
                                <div className="border-l border-gray-300 mx-2" />
                              )}
                            </div>
                          ))}
                        </div>
                        <EditorContent editor={editor} />
                      </div>
                    </div>
                  )
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kaduna-green"
                    placeholder={field.placeholder}
                    aria-required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
          {isPreview && (
            <div className="prose max-w-none list-disc list-outside border border-gray-300 p-4 rounded-md bg-white shadow-sm preview-content">
              <h2 className="text-2xl font-semibold">
                {formData.name || formData.title || `${titleLabel} Title`}
              </h2>
              {(type === "post" || type === "mda") && (
                <>
                  {formData.thumbnail && (
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail"
                      className="h-48 w-full object-cover mb-4"
                    />
                  )}
                  <p className="text-kaduna-gray text-sm">
                    By {formData.author || "Author"} |{" "}
                    {new Date().toLocaleString()}
                  </p>
                </>
              )}
              {type === "event" && (
                <>
                  <p className="text-kaduna-gray text-sm">
                    {formData.date || "Event Date"}
                  </p>
                  <p className="text-kaduna-gray text-sm">
                    {formData.location || "Event Location"}
                  </p>
                </>
              )}
              <div dangerouslySetInnerHTML={{ __html: formData.content }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEditor;

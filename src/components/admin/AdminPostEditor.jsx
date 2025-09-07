import React from "react";
import { useParams } from "react-router-dom";
import AdminEditor from "./AdminEditor";

const AdminPostEditor = () => {
  const { id } = useParams();

  const fields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Post Title",
      required: true,
    },
    {
      name: "author",
      label: "Author",
      type: "text",
      placeholder: "Author Name",
      required: true,
    },
    {
      name: "thumbnail",
      label: "Thumbnail Image",
      type: "file",
      placeholder: "Upload Thumbnail",
      accept: "image/*",
      required: false,
    },
    {
      name: "content",
      label: "HTML Content",
      type: "editor",
      placeholder: "",
      required: true,
    },
  ];

  return (
    <AdminEditor
      id={id}
      type="post"
      fields={fields}
      placeholder="Write your post content here..."
      titleLabel="Post"
      draftKeyPrefix="post-draft"
    />
  );
};

export default AdminPostEditor;

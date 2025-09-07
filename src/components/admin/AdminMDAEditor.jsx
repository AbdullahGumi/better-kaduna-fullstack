import React from "react";
import { useParams } from "react-router-dom";
import AdminEditor from "./AdminEditor";

const AdminMDAEditor = () => {
  const { id } = useParams();

  const fields = [
    {
      name: "name",
      label: "MDA Name",
      type: "text",
      placeholder: "MDA Name",
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
      type="mda"
      fields={fields}
      placeholder="Write your MDA content here..."
      titleLabel="MDA"
      draftKeyPrefix="mda-draft"
    />
  );
};

export default AdminMDAEditor;

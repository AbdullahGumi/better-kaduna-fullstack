import React from "react";
import { useParams } from "react-router-dom";
import AdminEditor from "./AdminEditor";

const AdminEventEditor = () => {
  const { id } = useParams();

  const fields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Event Title",
      required: true,
    },
    {
      name: "date",
      label: "Date",
      type: "datetime-local",
      placeholder: "Event Date",
      required: true,
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      placeholder: "Event Location",
      required: true,
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
      type="event"
      fields={fields}
      placeholder="Write your event description here..."
      titleLabel="Event"
      draftKeyPrefix="event-draft"
    />
  );
};

export default AdminEventEditor;

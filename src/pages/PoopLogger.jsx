import { useState } from "react";
import Greeting from "../components/Greeting";
import PoopForm from "../components/PoopForm";
import PoopTable from "../components/PoopTable";

export default function PoopLogger() {
  const [editingEntry, setEditingEntry] = useState(null);

  return (
    <div style={{ padding: "1rem" }}>
      <Greeting />
      <PoopForm editingEntry={editingEntry} setEditingEntry={setEditingEntry} />
      <PoopTable onEdit={setEditingEntry} />
    </div>
  );
}
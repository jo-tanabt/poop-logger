import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";

export default function PoopForm({ editingEntry, setEditingEntry }) {
  const [notes, setNotes] = useState("");
  const [consistency, setConsistency] = useState("firm");
  const [duration, setDuration] = useState("");
  const [effort, setEffort] = useState("3");
  const [foodCorrelation, setFoodCorrelation] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (editingEntry) {
      setNotes(editingEntry.notes || "");
      setConsistency(editingEntry.consistency || "firm");
      setDuration(editingEntry.duration?.toString() || "");
      setEffort(editingEntry.effort?.toString() || "3");
      setFoodCorrelation(editingEntry.foodCorrelation || "");
    }
  }, [editingEntry]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!duration || parseInt(duration) < 1) {
      toast.error("Please enter a valid poop duration.");
      return;
    }
    if (parseInt(effort) < 1 || parseInt(effort) > 5) {
      toast.error("Effort must be between 1 and 5.");
      return;
    }
    const poopData = {
      uid: user.uid,
      notes,
      consistency,
      duration: parseInt(duration),
      effort: parseInt(effort),
      foodCorrelation,
      timestamp: editingEntry?.timestamp || serverTimestamp(),
    };

    try {
      if (editingEntry?.id) {
        await setDoc(doc(db, "poop_logs", editingEntry.id), poopData);
        toast.success(
          consistency === "firm"
            ? "Firm and fabulous 💩"
            : consistency === "watery"
            ? "Splish splash 🫣"
            : "Rock solid 💪",
        );
      } else {
        await addDoc(collection(db, "poop_logs"), poopData);
        toast.success(
          consistency === "firm"
            ? "Firm and fabulous 💩"
            : consistency === "watery"
            ? "Splish splash 🫣"
            : "Rock solid 💪",
        );
      }
    } catch (err) {
      console.error("Error saving poop:", err);
    }

    // Reset form
    setNotes("");
    setConsistency("firm");
    setDuration("");
    setEffort("3");
    setFoodCorrelation("");
    setEditingEntry(null);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <form onSubmit={handleSubmit}>
        <h3>{editingEntry ? "Edit Poop 💩" : "Log a Poop 💩"}</h3>
        <textarea
          placeholder="Notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <div style={{ marginBottom: "1rem" }}>
          <label>Consistency: </label>
          <select
            value={consistency}
            onChange={(e) => setConsistency(e.target.value)}
          >
            <option value="hard">Hard</option>
            <option value="firm">Firm</option>
            <option value="watery">Watery</option>
          </select>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Duration (min): </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="0"
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Effort (1–5): </label>
          <input
            type="range"
            min="1"
            max="5"
            value={effort}
            onChange={(e) => setEffort(e.target.value)}
          />
          <span style={{ marginLeft: "0.5rem" }}>{effort}</span>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Food Correlation (optional): </label>
          <input
            type="text"
            value={foodCorrelation}
            onChange={(e) => setFoodCorrelation(e.target.value)}
          />
        </div>
        <button type="submit">{editingEntry ? "Update" : "Submit"}</button>
        {editingEntry && (
          <button type="button" onClick={() => setEditingEntry(null)} style={{ marginLeft: "1rem" }}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}
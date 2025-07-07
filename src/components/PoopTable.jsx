import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthProvider";

export default function PoopTable({ onEdit }) {
  const { user } = useAuth();
  const [poops, setPoops] = useState([]);
  const [sortField, setSortField] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "poop_logs"),
      where("uid", "==", user.uid),
      orderBy(sortField, sortOrder)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPoops(entries);
    });

    return () => unsubscribe();
  }, [user, sortField, sortOrder]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this poop entry?")) {
      await deleteDoc(doc(db, "poop_logs", id));
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Recent Poops</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th onClick={() => toggleSort("timestamp")}>Time</th>
            <th onClick={() => toggleSort("notes")}>Notes</th>
            <th onClick={() => toggleSort("consistency")}>Consistency</th>
            <th onClick={() => toggleSort("duration")}>Duration (min)</th>
            <th onClick={() => toggleSort("effort")}>Effort</th>
            <th onClick={() => toggleSort("foodCorrelation")}>Food</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {poops.map((entry, idx) => (
            <tr key={entry.id || idx}>
              <td>{entry.timestamp?.toDate().toLocaleString() || "-"}</td>
              <td>{entry.notes}</td>
              <td>{entry.consistency}</td>
              <td>{entry.duration}</td>
              <td>{entry.effort}</td>
              <td>{entry.foodCorrelation || "-"}</td>
              <td>
                <button onClick={() => handleDelete(entry.id)} style={{ marginRight: "0.5rem" }}>🗑</button>
                <button onClick={() => onEdit(entry)}>✏️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
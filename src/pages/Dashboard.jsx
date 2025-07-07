import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../context/AuthProvider";
import Greeting from "../components/Greeting";
import ChartDailyBar from "../components/ChartDailyBar";
import ChartTimeOfDay from "../components/ChartTimeOfDay";

export default function Dashboard() {
  const { user } = useAuth();
  const [poops, setPoops] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "poop_logs"),
      where("uid", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      }));
      setPoops(entries);
    });

    return () => unsubscribe();
  }, [user]);

  // Group by date
  const dateMap = {};
  const timeMap = {};
  const now = new Date();

  poops.forEach((entry) => {
    if (!entry.timestamp) return;

    const ts = entry.timestamp;
    const dateKey = ts.toISOString().split("T")[0];
    const hour = ts.getHours();
    const weekDiff = (now - ts) / (1000 * 60 * 60 * 24 * 7);

    // Count for daily bar
    if ((now - ts) / (1000 * 60 * 60 * 24) <= 6) {
      const dayName = ts.toLocaleDateString("en-US", { weekday: "short" });
      dateMap[dayName] = (dateMap[dayName] || 0) + 1;
    }

    // Count for time-of-day chart
    if (weekDiff <= 4.3) {
      let label = "";
      if (hour < 6) label = "12–6 AM";
      else if (hour < 9) label = "6–9 AM";
      else if (hour < 12) label = "9–12 PM";
      else if (hour < 15) label = "12–3 PM";
      else if (hour < 18) label = "3–6 PM";
      else if (hour < 21) label = "6–9 PM";
      else label = "9–12 AM";

      timeMap[label] = (timeMap[label] || 0) + 1;
    }
  });

  const avgPerDay = (poops.length / 30).toFixed(1);
  const avgPerWeek = (poops.length / 4.3).toFixed(1);

  const chartDataDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
    (d) => ({ day: d, count: dateMap[d] || 0 })
  );

  const chartDataTime = [
    "12–6 AM",
    "6–9 AM",
    "9–12 PM",
    "12–3 PM",
    "3–6 PM",
    "6–9 PM",
    "9–12 AM",
  ].map((t) => ({ time: t, count: timeMap[t] || 0 }));

  return (
    <div style={{ padding: "1rem" }}>
      <Greeting />
      <div style={{ marginTop: "2rem" }}>
        <h3>Average Poops</h3>
        <p style={{ fontSize: "2rem" }}>{avgPerDay} / day</p>
        <p style={{ fontSize: "2rem" }}>{avgPerWeek} / week</p>
      </div>
      <ChartDailyBar data={chartDataDay} />
      <ChartTimeOfDay data={chartDataTime} />
    </div>
  );
}
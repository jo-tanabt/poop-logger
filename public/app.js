import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5HoDV6NoN0yByWXUCD0BaQOoc14wBHGQ",
  authDomain: "poop-logger-ad469.firebaseapp.com",
  projectId: "poop-logger-ad469",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

let currentSort = { key: "timestamp", direction: "desc" };

function renderLogs(user) {
  const poopRef = collection(db, "poop_logs");
  getDocs(query(poopRef, where("uid", "==", user.uid))).then(snap => {
    let logs = [];
    snap.forEach(doc => logs.push(doc.data()));

    logs.sort((a, b) => {
      const key = currentSort.key;
      const dir = currentSort.direction === "asc" ? 1 : -1;
      if (key === "timestamp") return dir * (new Date(a.timestamp) - new Date(b.timestamp));
      return dir * a[key].localeCompare(b[key]);
    });

    const tableBody = document.querySelector("#poopTable tbody");
    tableBody.innerHTML = "";
    logs.forEach(data => {
      const row = document.createElement("tr");

      const timeCell = document.createElement("td");
      const date = new Date(data.timestamp);
      const options = { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true };
      timeCell.innerText = date.toLocaleString("en-GB", options);

      const notesCell = document.createElement("td");
      notesCell.innerText = data.notes;

      const consistencyCell = document.createElement("td");
      consistencyCell.innerText = data.consistency;

      row.appendChild(timeCell);
      row.appendChild(notesCell);
      row.appendChild(consistencyCell);

      tableBody.appendChild(row);
    });
  });
}

document.getElementById("loginBtn").onclick = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.getElementById("loginBtn").style.display = "none";

    const signOutBtn = document.createElement("button");
    signOutBtn.innerText = "Sign Out";
    signOutBtn.onclick = () => {
      auth.signOut();
      location.reload(); // Refresh to show login button again
    };
    document.body.insertBefore(signOutBtn, document.getElementById("app"));

    document.getElementById("app").style.display = "block";

    renderLogs(user);

    document.getElementById("logPoop").onclick = async () => {
      const notes = document.getElementById("poopNotes").value;
      const consistency = document.getElementById("poopConsistency").value;
      await addDoc(collection(db, "poop_logs"), {
        uid: user.uid,
        timestamp: new Date().toISOString(),
        notes: notes,
        consistency: consistency,
      });
      alert("Poop logged!");
      renderLogs(user);
    };
  }
});

["Time", "Notes", "Consistency"].forEach((label, i) => {
  document.querySelector(`#poopTable thead tr th:nth-child(${i + 1})`).style.cursor = "pointer";
  document.querySelector(`#poopTable thead tr th:nth-child(${i + 1})`).addEventListener("click", () => {
    const keys = ["timestamp", "notes", "consistency"];
    const clickedKey = keys[i];
    if (currentSort.key === clickedKey) {
      currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
    } else {
      currentSort.key = clickedKey;
      currentSort.direction = "asc";
    }
    renderLogs(auth.currentUser);
  });
});
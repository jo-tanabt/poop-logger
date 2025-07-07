

import { useAuth } from "../context/AuthProvider";

export default function Greeting() {
  const { user } = useAuth();
  const hour = new Date().getHours();

  let greeting = "Hello";
  if (hour < 5) greeting = "Good night";
  else if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

  return (
    <h2>
      {greeting}, {user?.displayName || "friend"}. Happy pooping!
    </h2>
  );
}
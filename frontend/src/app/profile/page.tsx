"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Für Redirects bei Nicht-Authentifizierung
import { useEffect } from "react";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Umleitung, wenn der Benutzer nicht angemeldet ist
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Weiterleitung zur Login-Seite
    }
  }, [status, router]);

  // Ladeanzeige während der Session-Überprüfung
  if (status === "loading") {
    return <p>Session wird geladen...</p>;
  }

  // Wenn der Benutzer nicht authentifiziert ist
  if (!session) {
    return <p>Du bist nicht angemeldet.</p>;
  }

  // Authentifizierter Benutzer
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Hallo, {session.user?.name || "Benutzer"}!</h1>
      <p>Email: {session.user?.email}</p>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Abmelden
      </button>
    </div>
  );
};

export default ProfilePage;

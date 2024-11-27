"use client"; // Erforderlich für die Nutzung von useSession und Client-Side Logic

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Für Redirects
import { useEffect } from "react";

const SignInPage = () => {
  const { data: session, status } = useSession(); // Session-Status überprüfen
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // Wenn der Benutzer bereits eingeloggt ist, leite ihn weiter
      router.push("/profile"); // Passe die Zielseite an
    }
  }, [status, router]);

  if (status === "authenticated") {
    // Zeige während der Weiterleitung eine Ladeanzeige
    return <p>Du bist bereits eingeloggt. Weiterleitung...</p>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h1>
        <p style={{ textAlign: "center", marginBottom: "20px" }}>
          Melde dich an, um Zugriff auf deine Inhalte zu erhalten.
        </p>

        <button
          onClick={() => signIn("keycloak")}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Mit Keycloak anmelden
        </button>
      </div>
    </div>
  );
};

export default SignInPage;

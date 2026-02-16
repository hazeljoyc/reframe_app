"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.sessionId;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui" }}>
      <p style={{ opacity: 0.7 }}>Session: {sessionId}</p>
      <Link href="/" style={{ marginTop: 16, color: "#243C2C" }}>← Back to Reframe</Link>
    </div>
  );
}

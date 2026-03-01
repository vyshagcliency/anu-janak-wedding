"use client";

import { useState, useEffect } from "react";

interface RSVPSubmission {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  events: string[];
}

const ADMIN_PASSWORD = "anu@123#34";

export default function AdminRSVPPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rsvps, setRsvps] = useState<RSVPSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchRSVPs();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const fetchRSVPs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/rsvp/list", {
        headers: {
          Authorization: `Bearer ${ADMIN_PASSWORD}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setRsvps(data.data);
      } else {
        setError("Failed to fetch RSVPs");
      }
    } catch (err) {
      setError("Error loading RSVPs");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const eventLabels: Record<string, string> = {
    sundowner: "Sundowner Carnival",
    sangeet: "Sangeet Mélange",
    wedding: "Wedding Ceremony",
    reception: "Reception",
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Guests", "Events", "Submitted At"];
    const rows = rsvps.map((rsvp) => [
      rsvp.name,
      rsvp.email,
      rsvp.phone || "N/A",
      rsvp.guests,
      rsvp.events.map((e) => eventLabels[e] || e).join("; "),
      formatDate(rsvp.timestamp),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvp-submissions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0D0A08 0%, #1A1512 100%)",
          padding: "1rem",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "2.5rem",
            maxWidth: "400px",
            width: "100%",
            border: "1px solid rgba(201, 169, 110, 0.2)",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "1.875rem",
              color: "#F8F4EE",
              marginBottom: "0.5rem",
              textAlign: "center",
            }}
          >
            RSVP Admin
          </h1>
          <p
            style={{
              color: "rgba(248, 244, 238, 0.6)",
              textAlign: "center",
              marginBottom: "2rem",
              fontSize: "0.875rem",
            }}
          >
            Enter password to view submissions
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(201, 169, 110, 0.3)",
                borderRadius: "8px",
                color: "#F8F4EE",
                outline: "none",
                marginBottom: "1rem",
                fontSize: "1rem",
              }}
            />
            {error && (
              <p
                style={{
                  color: "#ff6b6b",
                  fontSize: "0.875rem",
                  marginBottom: "1rem",
                }}
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.875rem",
                background: "linear-gradient(135deg, #C9A96E 0%, #E8D5B0 100%)",
                border: "none",
                borderRadius: "8px",
                color: "#0D0A08",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0D0A08 0%, #1A1512 100%)",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "2.25rem",
                color: "#F8F4EE",
                marginBottom: "0.5rem",
              }}
            >
              RSVP Submissions
            </h1>
            <p style={{ color: "rgba(248, 244, 238, 0.6)", fontSize: "1rem" }}>
              Total: {rsvps.length} {rsvps.length === 1 ? "response" : "responses"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={fetchRSVPs}
              disabled={loading}
              style={{
                padding: "0.75rem 1.5rem",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(201, 169, 110, 0.3)",
                borderRadius: "8px",
                color: "#F8F4EE",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
            {rsvps.length > 0 && (
              <button
                onClick={exportToCSV}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "linear-gradient(135deg, #C9A96E 0%, #E8D5B0 100%)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#0D0A08",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Export CSV
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#F8F4EE" }}>
            Loading...
          </div>
        ) : rsvps.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              border: "1px solid rgba(201, 169, 110, 0.2)",
            }}
          >
            <p style={{ color: "rgba(248, 244, 238, 0.6)", fontSize: "1.125rem" }}>
              No RSVP submissions yet
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {rsvps.map((rsvp) => (
              <div
                key={rsvp.id}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(201, 169, 110, 0.2)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: "rgba(248, 244, 238, 0.5)",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Name
                    </p>
                    <p
                      style={{
                        color: "#F8F4EE",
                        fontSize: "1.125rem",
                        fontWeight: "600",
                      }}
                    >
                      {rsvp.name}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        color: "rgba(248, 244, 238, 0.5)",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Email
                    </p>
                    <p style={{ color: "#C9A96E", fontSize: "1rem" }}>
                      {rsvp.email}
                    </p>
                  </div>

                  {rsvp.phone && (
                    <div>
                      <p
                        style={{
                          color: "rgba(248, 244, 238, 0.5)",
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Phone
                      </p>
                      <p style={{ color: "#F8F4EE", fontSize: "1rem" }}>
                        {rsvp.phone}
                      </p>
                    </div>
                  )}

                  <div>
                    <p
                      style={{
                        color: "rgba(248, 244, 238, 0.5)",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Guests
                    </p>
                    <p style={{ color: "#F8F4EE", fontSize: "1rem" }}>
                      {rsvp.guests}
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <p
                    style={{
                      color: "rgba(248, 244, 238, 0.5)",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Events Attending
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {rsvp.events.map((event) => (
                      <span
                        key={event}
                        style={{
                          background: "rgba(201, 169, 110, 0.2)",
                          border: "1px solid rgba(201, 169, 110, 0.4)",
                          borderRadius: "6px",
                          padding: "0.375rem 0.75rem",
                          fontSize: "0.875rem",
                          color: "#C9A96E",
                        }}
                      >
                        {eventLabels[event] || event}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "1rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(201, 169, 110, 0.15)",
                  }}
                >
                  <p
                    style={{
                      color: "rgba(248, 244, 238, 0.4)",
                      fontSize: "0.75rem",
                    }}
                  >
                    Submitted: {formatDate(rsvp.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

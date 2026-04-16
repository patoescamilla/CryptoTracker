import React, { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function App() {
  const [coins, setCoins] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/coins`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error obteniendo criptomonedas");
        }
        return response.json();
      })
      .then((data) => {
        setCoins(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo conectar al backend");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch(`${API}/api/history`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error obteniendo historial");
        }
        return response.json();
      })
      .then((data) => {
        setHistory(data);
        setHistoryLoading(false);
      })
      .catch(() => {
        setHistoryLoading(false);
      });
  }, []);

  if (loading) return <p style={styles.center}>Cargando informacion...</p>;
  if (error) return <p style={{ ...styles.center, color: "#b91c1c" }}>{error}</p>;

  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <p style={styles.kicker}>Fundamentos de DevOps</p>
        <h1 style={styles.title}>Crypto Tracker</h1>
        <p style={styles.subtitle}>
          Consulta el top 10 de criptomonedas y revisa el historial de peticiones
          almacenado en MongoDB.
        </p>
      </header>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Mercado actual</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              {["#", "Moneda", "Precio USD", "Cambio 24h"].map((heading) => (
                <th key={heading} style={styles.th}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr key={coin.id}>
                <td style={styles.td}>{coin.market_cap_rank}</td>
                <td style={styles.td}>
                  <img
                    src={coin.image}
                    alt={coin.name}
                    width={20}
                    style={styles.coinIcon}
                  />
                  {coin.name}
                </td>
                <td style={styles.td}>${coin.current_price.toLocaleString()}</td>
                <td
                  style={{
                    ...styles.td,
                    color:
                      coin.price_change_percentage_24h >= 0 ? "#15803d" : "#b91c1c",
                  }}
                >
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Historial reciente</h2>
        {historyLoading ? (
          <p style={styles.muted}>Cargando historial...</p>
        ) : history.length === 0 ? (
          <p style={styles.muted}>Todavia no hay consultas registradas.</p>
        ) : (
          <ul style={styles.historyList}>
            {history.slice(0, 8).map((item) => (
              <li key={item._id} style={styles.historyItem}>
                <span>{item.coin}</span>
                <span>{new Date(item.queriedAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Segoe UI, sans-serif",
    maxWidth: 980,
    margin: "0 auto",
    padding: "32px 16px 56px",
    color: "#0f172a",
  },
  hero: {
    background: "linear-gradient(135deg, #0f172a, #1d4ed8)",
    color: "#f8fafc",
    borderRadius: 24,
    padding: "32px 24px",
    marginBottom: 24,
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.2)",
  },
  kicker: {
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontSize: 12,
    margin: "0 0 8px",
    opacity: 0.9,
  },
  title: {
    margin: "0 0 10px",
    fontSize: "clamp(2rem, 4vw, 3rem)",
  },
  subtitle: {
    margin: 0,
    maxWidth: 620,
    lineHeight: 1.6,
  },
  card: {
    background: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
    overflowX: "auto",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: 16,
  },
  center: {
    textAlign: "center",
    marginTop: 60,
    fontFamily: "Segoe UI, sans-serif",
  },
  muted: {
    color: "#475569",
    margin: 0,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 620,
  },
  th: {
    background: "#0f172a",
    color: "#fff",
    padding: "12px 14px",
    textAlign: "left",
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid #e2e8f0",
  },
  coinIcon: {
    marginRight: 8,
    verticalAlign: "middle",
  },
  historyList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gap: 10,
  },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 12,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    flexWrap: "wrap",
  },
};

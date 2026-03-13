import { useState } from "react";

const nodes = {
  START: {
    id: "START",
    label: "NEW TRADE SESSION",
    question: "Is there a clear trend on the 4H chart?",
    yes: "PULLBACK",
    no: "NO_TRADE_1",
  },
  NO_TRADE_1: {
    id: "NO_TRADE_1",
    label: "NO TRADE",
    terminal: true,
    type: "skip",
    reason: "No 4H trend = no valid setup. Stay flat. Protect capital.",
  },
  PULLBACK: {
    id: "PULLBACK",
    question: "Is price pulling back into a key level (EMA, S/R, OB)?",
    yes: "BOS",
    no: "WAIT_1",
  },
  WAIT_1: {
    id: "WAIT_1",
    label: "WAIT",
    terminal: true,
    type: "wait",
    reason: "No pullback yet. Mark your level and wait. Do not chase.",
  },
  BOS: {
    id: "BOS",
    question: "On the 5-min, is there a Break of Structure (BOS) in trend direction?",
    yes: "PLAN",
    no: "WAIT_2",
  },
  WAIT_2: {
    id: "WAIT_2",
    label: "WAIT",
    terminal: true,
    type: "wait",
    reason: "No 5-min BOS yet. The setup isn't confirmed. Be patient.",
  },
  PLAN: {
    id: "PLAN",
    question: "Have you defined Entry, Stop, AND Target BEFORE entering?",
    yes: "RR_CHECK",
    no: "NO_TRADE_2",
  },
  NO_TRADE_2: {
    id: "NO_TRADE_2",
    label: "NO TRADE",
    terminal: true,
    type: "skip",
    reason: "No plan = no trade. Write out all three levels first. Non-negotiable.",
  },
  RR_CHECK: {
    id: "RR_CHECK",
    question: "Does the setup offer at least 2:1 R/R ($50–$100 target on $25–$50 risk)?",
    yes: "DAILY_LOSS",
    no: "NO_TRADE_3",
  },
  NO_TRADE_3: {
    id: "NO_TRADE_3",
    label: "NO TRADE",
    terminal: true,
    type: "skip",
    reason: "Poor R/R invalidates the setup. The math won't save you long-term.",
  },
  DAILY_LOSS: {
    id: "DAILY_LOSS",
    question: "Are you under your daily max loss limit ($50 / 2 losses)?",
    yes: "ENTER",
    no: "DONE_TODAY",
  },
  DONE_TODAY: {
    id: "DONE_TODAY",
    label: "DONE FOR THE DAY",
    terminal: true,
    type: "stop",
    reason: "Daily loss limit hit. Close platform. No exceptions. Come back tomorrow.",
  },
  ENTER: {
    id: "ENTER",
    label: "ENTER TRADE",
    question: "Place trade. Immediately set OCO order (stop + target). Step away.",
    yes: "IN_TRADE",
    no: "IN_TRADE",
    yesLabel: "I've set both orders ✓",
    noLabel: "Continue →",
  },
  IN_TRADE: {
    id: "IN_TRADE",
    label: "TRADE IS LIVE",
    question: "Is your unrealized profit at 75%+ of your target?",
    yes: "LOCK_IN",
    no: "HOLD",
  },
  HOLD: {
    id: "HOLD",
    label: "HOLD",
    question: "Has price hit your stop or full target?",
    yes: "EXIT",
    no: "IN_TRADE",
    yesLabel: "Yes, order filled",
    noLabel: "Still in trade →",
  },
  LOCK_IN: {
    id: "LOCK_IN",
    label: "🔒 LOCK-IN ZONE",
    question: "Move stop to lock in 60% of max profit NOW. Let it run to target or stop out a winner.",
    yes: "EXIT",
    no: "EXIT",
    yesLabel: "Stop moved ✓",
    noLabel: "Continue →",
    type: "lockin",
  },
  EXIT: {
    id: "EXIT",
    label: "TRADE CLOSED",
    question: "Log the trade. Did you follow every rule?",
    yes: "LOG_GOOD",
    no: "LOG_REVIEW",
    yesLabel: "Yes ✓",
    noLabel: "No — I broke a rule",
  },
  LOG_GOOD: {
    id: "LOG_GOOD",
    label: "✅ CLEAN EXECUTION",
    terminal: true,
    type: "win",
    reason: "Perfect. Outcome doesn't matter — process matters. Reset and look for the next valid setup.",
  },
  LOG_REVIEW: {
    id: "LOG_REVIEW",
    label: "📋 REVIEW REQUIRED",
    terminal: true,
    type: "review",
    reason: "Write down exactly which rule broke and why. No judgment — just data. This log is how you stop the pattern.",
  },
};

const typeStyles = {
  skip:   { bg: "#1a0a0a", border: "#ff3333", badge: "#ff3333", badgeText: "SKIP" },
  wait:   { bg: "#0d0f1a", border: "#4466ff", badge: "#4466ff", badgeText: "WAIT" },
  stop:   { bg: "#1a0a00", border: "#ff6600", badge: "#ff6600", badgeText: "STOP" },
  win:    { bg: "#001a0d", border: "#00cc66", badge: "#00cc66", badgeText: "CLEAN" },
  review: { bg: "#0f0f0a", border: "#ffcc00", badge: "#ffcc00", badgeText: "REVIEW" },
  lockin: { bg: "#0a1a0a", border: "#00ff99", badge: "#00ff99", badgeText: "LOCK IN" },
};

export default function DecisionTree() {
  const [current, setCurrent] = useState("START");
  const [history, setHistory] = useState([]);

  const node = nodes[current];

  const go = (next) => {
    setHistory((h) => [...h, current]);
    setCurrent(next);
  };

  const back = () => {
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrent(prev);
  };

  const reset = () => {
    setHistory([]);
    setCurrent("START");
  };

  const style = node.type ? typeStyles[node.type] : null;

  const progress = Math.round((history.length / (Object.keys(nodes).length - 1)) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080810",
      fontFamily: "'Courier New', monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(0,255,120,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,120,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ zIndex: 1, width: "100%", maxWidth: 600, marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <div style={{ color: "#00ff99", fontSize: 11, letterSpacing: 4, fontWeight: 700, marginBottom: 2 }}>MES TRADING SYSTEM</div>
            <div style={{ color: "#ffffff", fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>DECISION TREE</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#555", fontSize: 10, letterSpacing: 2, marginBottom: 4 }}>PROGRESS</div>
            <div style={{ color: "#00ff99", fontSize: 20, fontWeight: 700 }}>{progress}%</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 2, background: "#1a1a2e", borderRadius: 2 }}>
          <div style={{ height: 2, width: `${progress}%`, background: "linear-gradient(90deg, #00ff99, #4466ff)", borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>
      </div>

      {/* Breadcrumb */}
      {history.length > 0 && (
        <div style={{ zIndex: 1, width: "100%", maxWidth: 600, marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {history.map((h, i) => (
            <div key={i} style={{
              fontSize: 9, color: "#444", letterSpacing: 1,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <span style={{ color: "#333" }}>{nodes[h].label || h}</span>
              <span style={{ color: "#222" }}>›</span>
            </div>
          ))}
          <span style={{ fontSize: 9, color: "#00ff99", letterSpacing: 1 }}>{node.label || current}</span>
        </div>
      )}

      {/* Card */}
      <div style={{
        zIndex: 1,
        width: "100%",
        maxWidth: 600,
        background: style ? style.bg : "#0d0d1a",
        border: `1px solid ${style ? style.border : "#1e2040"}`,
        borderRadius: 2,
        padding: "32px",
        boxShadow: style ? `0 0 40px ${style.border}18` : "0 0 40px #00ff9908",
        transition: "all 0.3s ease",
      }}>

        {/* Node label */}
        {(node.label || style) && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            {style && (
              <div style={{
                background: style.badge,
                color: "#000",
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: 3,
                padding: "3px 8px",
                borderRadius: 1,
              }}>{style.badgeText}</div>
            )}
            {node.label && (
              <div style={{ color: style ? style.border : "#00ff99", fontSize: 12, letterSpacing: 3, fontWeight: 700 }}>
                {node.label}
              </div>
            )}
          </div>
        )}

        {/* Question / message */}
        <div style={{
          color: node.terminal ? "#aaa" : "#ffffff",
          fontSize: node.terminal ? 14 : 18,
          lineHeight: 1.6,
          marginBottom: 28,
          fontFamily: node.terminal ? "'Courier New', monospace" : "'Georgia', serif",
          fontStyle: node.terminal ? "normal" : "italic",
        }}>
          {node.terminal ? node.reason : node.question}
        </div>

        {/* Buttons */}
        {!node.terminal && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {node.yes && (
              <button onClick={() => go(node.yes)} style={{
                flex: 1, minWidth: 120,
                background: "transparent",
                border: "1px solid #00ff99",
                color: "#00ff99",
                padding: "12px 20px",
                fontSize: 11,
                letterSpacing: 3,
                fontWeight: 700,
                cursor: "pointer",
                borderRadius: 1,
                fontFamily: "'Courier New', monospace",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.target.style.background = "#00ff9915"; }}
                onMouseLeave={e => { e.target.style.background = "transparent"; }}
              >
                {node.yesLabel || "YES →"}
              </button>
            )}
            {node.no && node.yes !== node.no && (
              <button onClick={() => go(node.no)} style={{
                flex: 1, minWidth: 120,
                background: "transparent",
                border: "1px solid #ff3366",
                color: "#ff3366",
                padding: "12px 20px",
                fontSize: 11,
                letterSpacing: 3,
                fontWeight: 700,
                cursor: "pointer",
                borderRadius: 1,
                fontFamily: "'Courier New', monospace",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.target.style.background = "#ff336615"; }}
                onMouseLeave={e => { e.target.style.background = "transparent"; }}
              >
                {node.noLabel || "NO →"}
              </button>
            )}
          </div>
        )}

        {/* Terminal actions */}
        {node.terminal && (
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button onClick={reset} style={{
              background: "transparent",
              border: "1px solid #00ff99",
              color: "#00ff99",
              padding: "10px 24px",
              fontSize: 10,
              letterSpacing: 3,
              fontWeight: 700,
              cursor: "pointer",
              borderRadius: 1,
              fontFamily: "'Courier New', monospace",
            }}
              onMouseEnter={e => e.target.style.background = "#00ff9915"}
              onMouseLeave={e => e.target.style.background = "transparent"}
            >↺ NEW SESSION</button>
          </div>
        )}
      </div>

      {/* Back button */}
      {history.length > 0 && !node.terminal && (
        <button onClick={back} style={{
          zIndex: 1,
          marginTop: 16,
          background: "transparent",
          border: "none",
          color: "#333",
          fontSize: 10,
          letterSpacing: 2,
          cursor: "pointer",
          fontFamily: "'Courier New', monospace",
        }}
          onMouseEnter={e => e.target.style.color = "#666"}
          onMouseLeave={e => e.target.style.color = "#333"}
        >← BACK</button>
      )}

      {/* Rules footer */}
      <div style={{
        zIndex: 1, marginTop: 32, width: "100%", maxWidth: 600,
        borderTop: "1px solid #111",
        paddingTop: 20,
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12,
      }}>
        {[
          { label: "MAX DAILY LOSS", value: "$50" },
          { label: "MIN R/R", value: "2:1" },
          { label: "LOCK-IN TRIGGER", value: "75%" },
        ].map((r) => (
          <div key={r.label} style={{ textAlign: "center" }}>
            <div style={{ color: "#333", fontSize: 8, letterSpacing: 2, marginBottom: 4 }}>{r.label}</div>
            <div style={{ color: "#00ff99", fontSize: 16, fontWeight: 700 }}>{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
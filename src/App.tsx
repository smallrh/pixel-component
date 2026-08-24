import { useState } from "react";
import Playground from "./playground";
import Docs from "./docs/Docs";
import Dashboard from "./pages/Dashboard/Dashboard";
import ConfigProvider from "./components/ConfigProvider";
import AppProvider from "./components/App";
import Theme from "./components/Theme";
import LocaleProvider from "./components/LocaleProvider";

type PageType = "playground" | "docs" | "dashboard";

export default function App() {
  const [page, setPage] = useState<PageType>("dashboard");

  const btnStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--pixel-font)",
    fontSize: 11,
    padding: "4px 10px",
    border: `2px solid #000`,
    background: active ? "#000" : "#fff",
    color: active ? "#fff" : "#000",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: 1,
  });

  return (
    <ConfigProvider
      theme={{
        primaryColor: "#000",
        fontFamily: "var(--pixel-font)",
      }}
      locale="en"
    >
      <Theme>
        <LocaleProvider locale={{ locale: "en", messages: {} }}>
          <AppProvider>
            {page !== "dashboard" && (
              <div style={{ position: "fixed", top: 8, right: 8, zIndex: 9999, display: "flex", gap: 4 }}>
                <button onClick={() => setPage("playground")} style={btnStyle(page === "playground")}>
                  Playground
                </button>
                <button onClick={() => setPage("docs")} style={btnStyle(page === "docs")}>
                  Docs
                </button>
                <button onClick={() => setPage("dashboard")} style={btnStyle(page === "dashboard")}>
                  Dashboard
                </button>
              </div>
            )}
            {page === "playground" && <Playground />}
            {page === "docs" && <Docs />}
            {page === "dashboard" && <Dashboard />}
          </AppProvider>
        </LocaleProvider>
      </Theme>
    </ConfigProvider>
  );
}

import React, { Component, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import "./index.css";
import "./redesign.css";
import "./i18n/config";

// Dynamic non-blocking Sentry initialization
const sentryDsn = import.meta.env['VITE_SENTRY_DSN'] as string | undefined;
if (sentryDsn) {
  import("@sentry/react")
    .then((Sentry) => {
      Sentry.init({
        dsn: sentryDsn,
        environment: import.meta.env.MODE,
      });
    })
    .catch((err) => console.error("Failed to initialize Sentry:", err));
}

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, textAlign: "center", color: "#fff", background: "#0c0718", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h2>حدث خطأ غير متوقع / An unexpected error occurred</h2>
          <p style={{ marginTop: 8, opacity: 0.8 }}>يرجى إعادة تحديث الصفحة / Please refresh the page</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root")!;
const app = (
  <AppErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AppWrapper>
        <App />
      </AppWrapper>
    </ThemeProvider>
  </AppErrorBoundary>
);

// The markup inside #root is a crawler-only shell, not a React-rendered tree,
// so we always create a fresh root (hydrating would mismatch and re-render anyway).
createRoot(rootElement).render(app);

// Tell the inline splash in index.html that the app is on screen, so the
// curtain never lifts onto an empty page on a slow connection.
requestAnimationFrame(() => requestAnimationFrame(() => {
  (window as Window & { __el8AppReady?: boolean }).__el8AppReady = true;
  window.dispatchEvent(new Event('el8:app-ready'));
}));

import * as Sentry from "@sentry/react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import "./index.css";
import "./redesign.css";
import "./i18n/config";

Sentry.init({
  dsn: import.meta.env['VITE_SENTRY_DSN'] as string | undefined,
  environment: import.meta.env.MODE,
});

const rootElement = document.getElementById("root")!;
const app = (
  <Sentry.ErrorBoundary fallback={<p>应用发生错误，请刷新页面重试</p>}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AppWrapper>
        <App />
      </AppWrapper>
    </ThemeProvider>
  </Sentry.ErrorBoundary>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}

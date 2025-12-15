import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import Loading from "./components/common/Loading";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRouter from "./routes/AppRouter";
import AppRoot from "./components/layout/AppRoot"; // Import the new component
import "./styles/toast.css";
import { LoanProvider } from "./context/LoanContext";

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppRoot /> {/* This will apply the dark class to the HTML element */}
        <NotificationProvider>
          <LoanProvider>
            <BrowserRouter>
              <Suspense fallback={<Loading fullScreen />}>
                <AppRouter />
              </Suspense>
            </BrowserRouter>
          </LoanProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

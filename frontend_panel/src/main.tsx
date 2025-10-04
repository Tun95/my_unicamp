import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { DateRangeProvider } from "./context/DateRangeContext.tsx";
import { ApolloProvider } from "@apollo/client";
import { client } from "./graphql/client.ts";

createRoot(document.getElementById("root")!).render(
  <Router>
    <ApolloProvider client={client}>
      <ThemeProvider>
        <DateRangeProvider>
          <HelmetProvider>
            <StrictMode>
              <App />
            </StrictMode>
          </HelmetProvider>
        </DateRangeProvider>
      </ThemeProvider>
    </ApolloProvider>
  </Router>
);

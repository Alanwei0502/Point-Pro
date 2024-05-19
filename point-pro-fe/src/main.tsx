import React from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import router from "./router";
import { store } from "./store/store";
import theme from "./theme";
import "./index.css";

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <CssBaseline />
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

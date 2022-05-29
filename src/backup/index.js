import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import App from "./App"

const theme = createTheme({
  // palette: {
  //   primary: {
  //     light: "#6ec6ff",
  //     main: "#2196f3",
  //     dark: "#0069c0",
  //     contrastText: "#fff"
  //   },
  //   secondary: {
  //     light: "#62eeff",
  //     main: "#00bbd3",
  //     dark: "#008ba2",
  //     contrastText: "#000"
  //   }
  // }
})

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)

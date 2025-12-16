
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import './App.css'
import { Home } from './sections/Home'

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#60a5fa" },
    secondary: { main: "#c084fc" },
    background: {
      default: "#0f172a",
      paper: "#020617",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Home />
    </ThemeProvider>
  );
}

export default App

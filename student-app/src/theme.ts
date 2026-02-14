import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#90caf9" },
        secondary: { main: "#ce93d8" },
        background: {
            default: "#0b1220",
            paper: "#111827",
        },
    },
    shape: { borderRadius: 12 },
});

export default theme;

import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {CssBaseline, ThemeProvider} from "@mui/material";

import App from './App.tsx'
import AuthProvider from "./auth/AuthProvider.tsx";
import theme from "./theme.ts";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    </StrictMode>,
)

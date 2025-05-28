import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import {lightTheme, GlobalStyles} from 'amazon-chime-sdk-component-library-react';
import App from './App';
import './index.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles />
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)

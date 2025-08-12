import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import TestApi from "./pages/TestApi";

createRoot(document.getElementById('root')!).render(
 (<TestApi />)
)




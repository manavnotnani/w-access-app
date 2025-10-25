import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// Import network testing utilities for development
import { initializeNetwork } from './lib/network-testing'

// Initialize network on app startup
initializeNetwork();

createRoot(document.getElementById("root")!).render(<App />);

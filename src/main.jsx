import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import { store } from "./store/redux/store.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Router>
          <Provider store={store}>
              <App />
          </Provider>
      </Router>

  </StrictMode>,
)

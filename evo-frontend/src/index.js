import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import Tutorial from './components/Tutorial';
import './index.css'; // Assuming you have an index.css for global styles

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/tutorial" element={<Tutorial />} />
    </Routes>
    <Analytics />
  </Router>,
  document.getElementById('root')
);

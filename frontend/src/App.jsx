import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TripForm from "./TripForm";
import Features from "./Features";

import Tasks from "./Task";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TripForm />} />
        <Route path="/features" element={<Features />} />
      
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Router>
  );
}

export default App;

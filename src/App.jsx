import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import RealTimeTracking from "./IM/RealTimeTracking";

function App() {
  return(
        <Router>
        <Routes>
        <Route path="/" element={<RealTimeTracking />} />
        <Route path="/tracking" element={<RealTimeTracking />} />
        </Routes>
        </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./Home";
import IM from "./IM";
import LM from "./LM";
import OptimiseStock from "./IM/OptimiseStock";
import RealTimeTracking from "./IM/RealTimeTracking";
import PredictiveDemand from "./IM/PredictiveDemand";

function App() {
  return(
        <Router>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<IM />} />
        <Route path="/LastMile" element={<LM />} />
        <Route path="/inventory/optimise" element={<OptimiseStock />} />
        <Route path="/inventory/tracking" element={<RealTimeTracking />} />
        <Route path="/inventory/predictive" element={<PredictiveDemand />} />
        </Routes>
        </Router>
  );
}

export default App;

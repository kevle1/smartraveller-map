import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Map from "./components/Map";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Map />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

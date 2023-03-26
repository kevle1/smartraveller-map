import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Home from './pages/Home';
import Page from './pages/Page';

function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/page" element={<Page/>}/>
          </Routes>
      </Router>
    </div>
  )
}

export default App

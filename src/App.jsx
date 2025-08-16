import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/landing";
import BeachGame from "./components/bughuntbay"; // your game component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/java" element={<BeachGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


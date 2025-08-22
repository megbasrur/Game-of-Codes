import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/landing";
import BeachGame from "./components/bughuntbay"; 
import Start from "./components/start";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start/>} />
         <Route path="/landing" element={<LandingPage/>} />
        <Route path="/java" element={<BeachGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/landing";
import BeachGame from "./components/bughuntbay"; 
import Start from "./components/start";
import LanguagePage from "./components/LanguagePage";
import PlanetPage from "./components/PlanetPage";
import DebugBeachGame from "./components/bughuntbay";
import Login from './components/login';
import Signup from "./components/signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start/>} />
         <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
        <Route path="/landing" element={<LandingPage/>} />
        <Route
          path="/java"
          element={
            <LanguagePage
              name="Java"
              description="Welcome to the Java Universe! Begin your coding journey with this powerful coding language and learn how to code your own applications"
            />
          }
        />
        <Route path="/planet/:planetId" element={<PlanetPage />} />
        <Route path="/planet/:1/game/0" element={<DebugBeachGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

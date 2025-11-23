import { useParams } from "react-router-dom";
import DebugBeachGame from "./bughuntbay";
import MessageInBottle from "./messageinabottle";
import DessertPyramid from "./PYRAMIDGAMEPLANET1";


// Map each planet to its games array
const planetGames = {
  0: [DebugBeachGame, MessageInBottle, DessertPyramid], // Planet 1 games
};

export default function PlanetGame() {
  const { planetId, gameId } = useParams();
  const GameComponent = planetGames[planetId]?.[gameId];

  if (!GameComponent) return <div>Game not found for this planet.</div>;
  return <GameComponent />;
}

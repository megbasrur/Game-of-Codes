import { useParams } from "react-router-dom";
import DebugBeachGame from "./bughuntbay";
import MessageInBottle from "./messageinabottle";
import DessertPyramid from "./PYRAMIDGAMEPLANET1";
import PotionMixUp from "./PotionMixUp";
import EnchantedMathGarden from "./EnchantedMathGarden";
import HerosDillema from "./HerosDillema";
import TalkToTroll from "./TalkToTroll";
import PowerSelector from "./PowerSelector";
import MultiverseMaze from "./MultiverseMaze";

// Map each planet to its games array (planetId from URL is string key)
const planetGames = {
  0: [DebugBeachGame, MessageInBottle, DessertPyramid],
  1: [PotionMixUp, EnchantedMathGarden, TalkToTroll],
  3: [HerosDillema, PowerSelector, MultiverseMaze],
};

export default function PlanetGame() {
  const { planetId, gameId } = useParams();
  const GameComponent = planetGames[planetId]?.[gameId];

  if (!GameComponent) return <div>Game not found for this planet.</div>;
  return <GameComponent />;
}

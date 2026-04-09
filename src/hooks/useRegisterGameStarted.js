import { useEffect, useRef } from "react";
import { apiRequest } from "../lib/api";

/**
 * Call once when the game screen mounts so the title appears on home Game Progress
 * (score 0, not completed) before the player finishes.
 */
export function useRegisterGameStarted(gameId) {
  const sent = useRef(false);
  useEffect(() => {
    if (!gameId || sent.current) return;
    sent.current = true;
    apiRequest(`/progress/${gameId}/complete`, {
      method: "POST",
      body: JSON.stringify({ score: 0, completed: false }),
    }).catch(() => {});
  }, [gameId]);
}

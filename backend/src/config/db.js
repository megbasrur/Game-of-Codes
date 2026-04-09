import mongoose from "mongoose";
import Game from "../models/Game.js";
import defaultGames from "./defaultGames.js";

export async function connectAndSeedDatabase(mongoUri) {
  if (!mongoUri) throw new Error("Missing MONGODB_URI in environment");

  await mongoose.connect(mongoUri);

  try {
    const indexes = await Game.collection.indexes();
    const hasLegacyNameIndex = indexes.some((idx) => idx.name === "name_1");
    if (hasLegacyNameIndex) {
      await Game.collection.dropIndex("name_1");
    }
  } catch (error) {
    console.warn("Index cleanup skipped:", error.message);
  }

  for (const game of defaultGames) {
    await Game.updateOne({ id: game.id }, { $set: game }, { upsert: true });
  }
}

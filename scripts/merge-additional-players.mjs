import { promises as fs } from "fs";
import path from "path";

const runtimePlayersPath = path.join(process.cwd(), "data", "runtime", "players.json");
const additionalPlayersPath = path.join(process.cwd(), "data", "additional-players.json");

async function main() {
  const runtimePlayers = JSON.parse(await fs.readFile(runtimePlayersPath, "utf8"));
  const additionalPlayers = JSON.parse(await fs.readFile(additionalPlayersPath, "utf8"));

  const existing = new Map(runtimePlayers.map((player) => [player.id, player]));

  for (const player of additionalPlayers) {
    existing.set(player.id, player);
  }

  const mergedPlayers = Array.from(existing.values());
  await fs.writeFile(runtimePlayersPath, JSON.stringify(mergedPlayers, null, 2), "utf8");
  console.log(`Merged players: ${runtimePlayers.length} -> ${mergedPlayers.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

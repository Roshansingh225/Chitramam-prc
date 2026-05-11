import { promises as fs } from "fs";
import path from "path";

const playersPath = path.join(process.cwd(), "data", "runtime", "players.json");
const outputMapPath = path.join(process.cwd(), "lib", "data", "player-images.ts");

const STATIC_OVERRIDES = {
  "csk-devon-conway": "/player-images/csk-devon-conway.jpg",
  "csk-matheesha-pathirana": "/player-images/csk-matheesha-pathirana.png",
  "csk-ms-dhoni": "/player-images/csk-ms-dhoni.jpg",
  "csk-ravindra-jadeja": "/player-images/csk-ravindra-jadeja.jpg",
  "csk-ruturaj-gaikwad": "/player-images/csk-ruturaj-gaikwad.jpg",
  "csk-shivam-dube": "/player-images/csk-shivam-dube.jpg"
};

const TITLE_OVERRIDES = {
  "AB de Villiers": "AB de Villiers",
  "Ajinkya Rahane": "Ajinkya Rahane",
  "Amit Mishra": "Amit Mishra",
  "Anil Kumble": "Anil Kumble",
  "Ayush Badoni": "Ayush Badoni",
  "Bhuvneshwar Kumar": "Bhuvneshwar Kumar",
  "Chris Gayle": "Chris Gayle",
  "Dale Steyn": "Dale Steyn",
  "David Miller": "David Miller (cricketer)",
  "Devon Conway": "Devon Conway",
  "Dinesh Karthik": "Dinesh Karthik",
  "Dwayne Bravo": "Dwayne Bravo",
  "Faf du Plessis": "Faf du Plessis",
  "Gautam Gambhir": "Gautam Gambhir",
  "Heinrich Klaasen": "Heinrich Klaasen",
  "Ishant Sharma": "Ishant Sharma",
  "Jasprit Bumrah": "Jasprit Bumrah",
  "Jofra Archer": "Jofra Archer",
  "Jonny Bairstow": "Jonny Bairstow",
  "Jos Buttler": "Jos Buttler",
  "Kagiso Rabada": "Kagiso Rabada",
  "Kane Williamson": "Kane Williamson",
  "Kieron Pollard": "Kieron Pollard",
  "KL Rahul": "KL Rahul",
  "Krunal Pandya": "Krunal Pandya",
  "Kuldeep Yadav": "Kuldeep Yadav",
  "Lasith Malinga": "Lasith Malinga",
  "Liam Livingstone": "Liam Livingstone",
  "Marcus Stoinis": "Marcus Stoinis",
  "Matheesha Pathirana": "Matheesha Pathirana",
  "Mayank Yadav": "Mayank Yadav (cricketer)",
  "Mitchell Marsh": "Mitchell Marsh",
  "Mohammed Shami": "Mohammed Shami",
  "MS Dhoni": "MS Dhoni",
  "Noor Ahmad": "Noor Ahmad",
  "Pat Cummins": "Pat Cummins",
  "Phil Salt": "Phil Salt (cricketer)",
  "Quinton de Kock": "Quinton de Kock",
  "R Ashwin": "Ravichandran Ashwin",
  "Rashid Khan": "Rashid Khan",
  "Ravichandran Ashwin": "Ravichandran Ashwin",
  "Ravindra Jadeja": "Ravindra Jadeja",
  "Rishabh Pant": "Rishabh Pant",
  "Robin Uthappa": "Robin Uthappa",
  "Rohit Sharma": "Rohit Sharma",
  "S Sreesanth": "S. Sreesanth",
  "Sachin Tendulkar": "Sachin Tendulkar",
  "Sai Kishore": "Ravisrinivasan Sai Kishore",
  "Sam Curran": "Sam Curran",
  "Sanju Samson": "Sanju Samson",
  "Shaun Marsh": "Shaun Marsh",
  "Shane Watson": "Shane Watson",
  "Shikhar Dhawan": "Shikhar Dhawan",
  "Shivam Dube": "Shivam Dube",
  "Shreyas Iyer": "Shreyas Iyer",
  "Suryakumar Yadav": "Suryakumar Yadav",
  "T Natarajan": "T. Natarajan",
  "Tilak Varma": "Tilak Varma",
  "Travis Head": "Travis Head",
  "Trent Boult": "Trent Boult",
  "Varun Chakravarthy": "Varun Chakravarthy",
  "Virat Kohli": "Virat Kohli",
  "Virender Sehwag": "Virender Sehwag",
  "Wriddhiman Saha": "Wriddhiman Saha",
  "Yashasvi Jaiswal": "Yashasvi Jaiswal",
  "Yuvraj Singh": "Yuvraj Singh",
  "Yuzvendra Chahal": "Yuzvendra Chahal"
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url, attempt = 1) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "IPL-Mind-Reader-AI/1.0"
    }
  });

  if ((response.status === 429 || response.status >= 500) && attempt < 10) {
    await sleep(Math.min(12000, attempt * 2500));
    return fetchJson(url, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}: ${url}`);
  }

  return response.json();
}

function sanitizeName(name) {
  return name.replace(/\s+/g, " ").trim().toLowerCase();
}

function normalizeTitle(title) {
  return sanitizeName(title)
    .replace(/[().']/g, "")
    .replace(/\s+-\s+cricketer$/, "")
    .replace(/\s+cricketer$/, "")
    .trim();
}

async function fetchPagesByTitles(titles) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "pageimages",
    piprop: "thumbnail",
    pithumbsize: "900",
    redirects: "1",
    titles: titles.join("|")
  });

  const payload = await fetchJson(`https://en.wikipedia.org/w/api.php?${params.toString()}`);
  const pages = Object.values(payload?.query?.pages ?? {});
  const pagesByTitle = new Map(pages.filter((page) => page?.title).map((page) => [page.title, page]));
  const normalizedTitles = new Map((payload?.query?.normalized ?? []).map((entry) => [entry.from, entry.to]));
  const redirectTitles = new Map((payload?.query?.redirects ?? []).map((entry) => [entry.from, entry.to]));

  function resolveTitle(title) {
    let currentTitle = normalizedTitles.get(title) ?? title;

    while (redirectTitles.has(currentTitle)) {
      currentTitle = redirectTitles.get(currentTitle);
    }

    return currentTitle;
  }

  return new Map(
    titles.map((title) => {
      const resolvedTitle = resolveTitle(title);
      return [title, pagesByTitle.get(resolvedTitle) ?? null];
    })
  );
}

async function searchPage(playerName) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `${playerName} cricketer`,
    gsrlimit: "5",
    prop: "pageimages",
    piprop: "thumbnail",
    pithumbsize: "900",
  });

  const payload = await fetchJson(`https://en.wikipedia.org/w/api.php?${params.toString()}`);
  return Object.values(payload?.query?.pages ?? {});
}

function mappingFileContent(mapping) {
  const rows = Object.entries(mapping)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `  "${key}": "${value}"`)
    .join(",\n");

  return `export const PLAYER_IMAGE_MAP: Record<string, string> = {\n${rows}\n};\n`;
}

async function main() {
  const players = JSON.parse(await fs.readFile(playersPath, "utf8"));
  const mapping = {};
  const unresolved = [];

  const candidateTitles = new Map();
  for (const player of players) {
    if (STATIC_OVERRIDES[player.id]) {
      mapping[player.id] = STATIC_OVERRIDES[player.id];
      continue;
    }

    candidateTitles.set(
      player.id,
      Array.from(
        new Set(
          [TITLE_OVERRIDES[player.name], player.name, `${player.name} (cricketer)`]
            .filter(Boolean)
            .map((title) => title.trim())
        )
      )
    );
  }

  for (const candidateIndex of [0, 1, 2]) {
    const unresolvedPlayers = players.filter((player) => !mapping[player.id]);
    const titles = Array.from(
      new Set(
        unresolvedPlayers
          .map((player) => candidateTitles.get(player.id)?.[candidateIndex])
          .filter(Boolean)
      )
    );

    for (let index = 0; index < titles.length; index += 40) {
      const batch = titles.slice(index, index + 40);
      if (batch.length === 0) {
        continue;
      }

      const pagesByRequestedTitle = await fetchPagesByTitles(batch);

      for (const player of unresolvedPlayers) {
        const titlesForPlayer = candidateTitles.get(player.id) ?? [];
        const requestedTitle = titlesForPlayer[candidateIndex];
        const normalizedCandidates = new Set(titlesForPlayer.map(normalizeTitle));
        const page = requestedTitle ? pagesByRequestedTitle.get(requestedTitle) : null;

        if (page?.thumbnail?.source && normalizedCandidates.has(normalizeTitle(page.title))) {
          mapping[player.id] = page.thumbnail.source;
        }
      }

      await sleep(220);
    }
  }

  for (const player of players) {
    if (mapping[player.id]) {
      continue;
    }

    const titlesForPlayer = candidateTitles.get(player.id) ?? [player.name];
    const normalizedCandidates = new Set(titlesForPlayer.map(normalizeTitle));
    const searchPages = await searchPage(player.name);
    const searchMatch = searchPages.find((page) => {
      return page?.thumbnail?.source && normalizedCandidates.has(normalizeTitle(page.title));
    });

    if (searchMatch?.thumbnail?.source) {
      mapping[player.id] = searchMatch.thumbnail.source;
      await sleep(180);
      continue;
    }

    unresolved.push(player.name);
    await sleep(180);
  }

  await fs.writeFile(outputMapPath, mappingFileContent(mapping), "utf8");

  console.log(`Resolved ${Object.keys(mapping).length}/${players.length} player portraits.`);

  if (unresolved.length > 0) {
    console.log("\nUnresolved players:");
    for (const name of unresolved) {
      console.log(`- ${name}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

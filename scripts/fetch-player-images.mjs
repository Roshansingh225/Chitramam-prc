import { promises as fs } from "fs";
import path from "path";

const projectRoot = process.cwd();
const playersPath = path.join(projectRoot, "data", "runtime", "players.json");
const imagesDir = path.join(projectRoot, "public", "player-images");
const outputMapPath = path.join(projectRoot, "lib", "data", "player-images.ts");
const PAGE_TITLE_OVERRIDES = {
  "Mayank Yadav": "Mayank Yadav (cricketer)",
  "Phil Salt": "Phil Salt (cricketer)",
  "T Natarajan": "T. Natarajan",
  "David Miller": "David Miller (cricketer)",
  "Mitchell Marsh": "Mitchell Marsh",
  "KL Rahul": "KL Rahul",
  "MS Dhoni": "MS Dhoni"
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sanitizeTitle(value) {
  return value.replace(/\s+/g, " ").trim();
}

function playerQueries(player) {
  const countryLabel = player.country === "West Indies" ? "West Indian" : player.country;

  return [
    `${player.name} cricketer`,
    `${player.name} ${countryLabel} cricketer`,
    `${player.name} IPL cricketer`,
    player.name
  ];
}

async function searchWikipedia(query) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: query,
    gsrlimit: "5",
    prop: "pageimages|info",
    inprop: "url",
    piprop: "thumbnail",
    pithumbsize: "900",
    origin: "*"
  });

  const response = await fetch(`https://en.wikipedia.org/w/api.php?${params.toString()}`, {
    headers: {
      "User-Agent": "IPL-Mind-Reader-AI/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Wikipedia search failed for "${query}" with ${response.status}`);
  }

  const payload = await response.json();
  const pages = Object.values(payload?.query?.pages ?? {});

  return pages
    .filter((page) => page.thumbnail?.source)
    .sort((left, right) => (left.index ?? 999) - (right.index ?? 999));
}

async function fetchWikipediaTitle(title) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    titles: title,
    prop: "pageimages|info",
    inprop: "url",
    piprop: "thumbnail",
    pithumbsize: "900",
    origin: "*"
  });

  const response = await fetch(`https://en.wikipedia.org/w/api.php?${params.toString()}`, {
    headers: {
      "User-Agent": "IPL-Mind-Reader-AI/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Wikipedia title lookup failed for "${title}" with ${response.status}`);
  }

  const payload = await response.json();
  const pages = Object.values(payload?.query?.pages ?? {});
  return pages.find((page) => !page.missing && page.thumbnail?.source) ?? null;
}

function titleLooksRelated(player, title) {
  const normalizedTitle = sanitizeTitle(title).toLowerCase();
  const tokens = sanitizeTitle(player.name)
    .toLowerCase()
    .replace(/[().']/g, "")
    .split(/\s+/)
    .filter((token) => token.length >= 3);

  return tokens.some((token) => normalizedTitle.includes(token));
}

function imageExtensionFromUrl(url) {
  const cleanUrl = url.split("?")[0];
  const ext = path.extname(cleanUrl).toLowerCase();

  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png" || ext === ".webp") {
    return ext === ".jpeg" ? ".jpg" : ext;
  }

  return ".jpg";
}

async function downloadImage(url, outputFilePath, attempt = 1) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "IPL-Mind-Reader-AI/1.0"
    }
  });

  if (response.status === 429 && attempt < 5) {
    const retryAfter = Number(response.headers.get("retry-after") || 0);
    const waitMs = retryAfter > 0 ? retryAfter * 1000 : attempt * 1500;
    await sleep(waitMs);
    return downloadImage(url, outputFilePath, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`Image download failed with ${response.status} for ${url}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(outputFilePath, bytes);
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
  await fs.mkdir(imagesDir, { recursive: true });

  const mapping = {};
  const unresolved = [];

  for (const player of players) {
    let chosenPage = null;
    const titleCandidates = [
      PAGE_TITLE_OVERRIDES[player.name],
      player.name,
      `${player.name} (cricketer)`
    ].filter(Boolean);

    for (const title of titleCandidates) {
      const page = await fetchWikipediaTitle(title);

      if (page && titleLooksRelated(player, page.title)) {
        chosenPage = page;
        break;
      }
    }

    if (!chosenPage) {
      for (const query of playerQueries(player)) {
        const pages = await searchWikipedia(query);
        const exactMatch = pages.find((page) => {
          const title = sanitizeTitle(page.title).toLowerCase();
          const name = sanitizeTitle(player.name).toLowerCase();

          return title === name || title === `${name} (cricketer)`;
        });
        const closeMatch = pages.find((page) => titleLooksRelated(player, page.title));

        chosenPage = exactMatch ?? closeMatch ?? null;

        if (chosenPage) {
          break;
        }
      }
    }

    if (!chosenPage?.thumbnail?.source) {
      unresolved.push(player.name);
      continue;
    }

    const extension = imageExtensionFromUrl(chosenPage.thumbnail.source);
    const fileName = `${player.id}${extension}`;
    const localPath = `/player-images/${fileName}`;
    const outputFilePath = path.join(imagesDir, fileName);

    await downloadImage(chosenPage.thumbnail.source, outputFilePath);
    mapping[player.id] = localPath;

    console.log(`Saved ${player.name} -> ${localPath} (${chosenPage.title})`);
    await sleep(350);
  }

  await fs.writeFile(outputMapPath, mappingFileContent(mapping), "utf8");

  if (unresolved.length > 0) {
    console.log("\nUnresolved players:");
    for (const name of unresolved) {
      console.log(`- ${name}`);
    }
  } else {
    console.log("\nAll player images resolved.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

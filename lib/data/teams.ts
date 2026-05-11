import { Team } from "@/types";

export const TEAMS: Team[] = [
  {
    id: "csk",
    name: "Chennai Super Kings",
    shortName: "CSK",
    city: "Chennai",
    stadium: "M. A. Chidambaram Stadium",
    primary: "#fdb913",
    accent: "#33d2ff",
    glow: "from-amber-300/35 via-amber-500/25 to-cyan-400/25",
    strapline: "Yellow thunder built on calm finishes."
  },
  {
    id: "rcb",
    name: "Royal Challengers Bengaluru",
    shortName: "RCB",
    city: "Bengaluru",
    stadium: "M. Chinnaswamy Stadium",
    primary: "#ef3340",
    accent: "#ffd166",
    glow: "from-rose-400/35 via-red-500/25 to-amber-300/25",
    strapline: "High-voltage batting and loud stadium nights."
  },
  {
    id: "mi",
    name: "Mumbai Indians",
    shortName: "MI",
    city: "Mumbai",
    stadium: "Wankhede Stadium",
    primary: "#005da0",
    accent: "#7fd6ff",
    glow: "from-sky-400/35 via-blue-500/25 to-cyan-300/25",
    strapline: "Blue-gold dynasty energy with elite pace."
  },
  {
    id: "gt",
    name: "Gujarat Titans",
    shortName: "GT",
    city: "Ahmedabad",
    stadium: "Narendra Modi Stadium",
    primary: "#0b1f3a",
    accent: "#7bdff6",
    glow: "from-slate-300/25 via-sky-500/15 to-blue-500/20",
    strapline: "Precision, pace, and cool-headed chases."
  },
  {
    id: "kkr",
    name: "Kolkata Knight Riders",
    shortName: "KKR",
    city: "Kolkata",
    stadium: "Eden Gardens",
    primary: "#522583",
    accent: "#ffd166",
    glow: "from-violet-400/35 via-fuchsia-500/20 to-amber-300/20",
    strapline: "Mystery spin and fearless finishers."
  },
  {
    id: "srh",
    name: "Sunrisers Hyderabad",
    shortName: "SRH",
    city: "Hyderabad",
    stadium: "Rajiv Gandhi International Stadium",
    primary: "#f15a24",
    accent: "#ffdb7e",
    glow: "from-orange-300/35 via-orange-500/20 to-yellow-300/20",
    strapline: "Explosive openers under blazing lights."
  },
  {
    id: "rr",
    name: "Rajasthan Royals",
    shortName: "RR",
    city: "Jaipur",
    stadium: "Sawai Mansingh Stadium",
    primary: "#ff69b4",
    accent: "#8ddfff",
    glow: "from-pink-400/35 via-fuchsia-500/20 to-cyan-300/20",
    strapline: "Young royalty with fearless stroke play."
  },
  {
    id: "pbks",
    name: "Punjab Kings",
    shortName: "PBKS",
    city: "Mullanpur",
    stadium: "Maharaja Yadavindra Singh Stadium",
    primary: "#d71920",
    accent: "#fefefe",
    glow: "from-red-400/35 via-rose-500/20 to-zinc-200/20",
    strapline: "Firepower with all-action all-rounders."
  },
  {
    id: "lsg",
    name: "Lucknow Super Giants",
    shortName: "LSG",
    city: "Lucknow",
    stadium: "Ekana Cricket Stadium",
    primary: "#00a0dd",
    accent: "#ff8b2d",
    glow: "from-cyan-300/35 via-sky-500/20 to-orange-300/20",
    strapline: "Sharp tactics, serious pace, and late chaos."
  },
  {
    id: "dc",
    name: "Delhi Capitals",
    shortName: "DC",
    city: "Delhi",
    stadium: "Arun Jaitley Stadium",
    primary: "#004c93",
    accent: "#ef3340",
    glow: "from-blue-400/35 via-blue-600/20 to-red-400/20",
    strapline: "Dynamic young stars with a bold edge."
  }
];

export const TEAM_MAP = Object.fromEntries(TEAMS.map((team) => [team.id, team]));
